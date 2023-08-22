import express from 'express';
import { db } from '../config';
import { fieldToTable, fields, getThiefData, MergeThieves } from '../thiefData';
import { uploadImage, deleteImage, getImage, ImageUploadError, ImageDeletionError, ImageGetError} from '../imageOperation';
import multer from 'multer';
import { insertThiefData, deleteThiefData } from '../thiefData';

const upload = multer();

async function get(query: any) {
	return getThiefData([parseInt(query.thiefId)]);
};

async function put(body: any) {
	let thiefId = body.thiefId;
	if (thiefId == 'new') {
		// (new thief, get next thief_id)
		thiefId = (await db.one("SELECT nextval('next_thief_id')"))['nextval'];
	}
	
	if (thiefId === 'merge') {
		//return body.thiefIdMap[0];
		let newThiefId = body.thiefIdMap[1]; 
		if (body.thiefIdMap[0] !== body.thiefIdMap[1]) {
			newThiefId = await MergeThieves(body);		
		}
		body.thiefId, thiefId = newThiefId;
	}
	thiefId = parseInt(thiefId);
	for (let field of fields) {
		if (!body[field]) { continue; }
		let table = fieldToTable[field];
		let delVals = body[field].delVals;
		let addVals = body[field].addVals;
		for (let delVal of delVals) {
			if (delVal === '') { continue; }
			deleteThiefData(table, thiefId, delVal);
		}
		for (let addVal of addVals) {
			if (addVal === '') { continue; }
			insertThiefData(table, thiefId, addVal);
		}
	}
	return thiefId;
};

const router = express.Router();
router.get('/', async (req: express.Request, res: express.Response) => {
	try {
		res.json({
			thiefInfo: await get(req.query),
			imageUrls: await getImage(req.query.thiefId as string),
		});
	} catch (err) {
		if (err instanceof ImageGetError) {
			console.log('ImageGetError', err);
			res.status(400).send("Error getting image");
		} else {
			console.error(err);
			res.status(500);
		}
	}
});

router.get('/images', async (req: express.Request, res: express.Response) => {
	try {
		res.json(await getImage(req.query.thiefId as string));
	} catch (err) {
		if (err instanceof ImageGetError) {
			console.error(err);
			res.status(400).send("Error getting image");
		}
		console.error(err);
		res.status(500);
	}

})

router.put('/', upload.array('newImages'), async (req: express.Request, res: express.Response) => {
	try {
		const thiefId = await put(JSON.parse(req.body.body));

		const promises = [];
		if (req.files && req.files.length !== 0) {
			promises.push(uploadImage(req.files as Express.Multer.File[], thiefId));
		}
		if (req.body.deletedImages) {
			promises.push(deleteImage(JSON.parse(req.body.deletedImages), thiefId));
		}
		await Promise.all(promises);

		res.status(200).json({ thiefId });
	} catch (err) {
		if (err instanceof ImageUploadError) {
			console.error(err);
			res.status(422).send("Error uploading file");
		} else if (err instanceof ImageDeletionError) {
			console.error(err);
			res.status(422).send("Error deleting file");
		} else {
			console.error(err);
			res.status(500);
		}
	}
});
export default router;
