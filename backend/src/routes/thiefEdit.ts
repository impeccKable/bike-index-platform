import express from 'express';
import { db } from '../config';
import { fieldToTable, fields, getThiefData } from '../thiefData';
import { uploadImage, deleteImage, getFile, ImageUploadError, ImageDeletionError, ImageGetError } from '../imageOperation';
import multer from 'multer';
import { insertThiefData, deleteThiefData } from '../thiefData';

const upload = multer();

async function get(query: any) {
	return getThiefData([parseInt(query.thiefId)]);
};

async function put(body: any) {
	let thiefId = body.thiefId;
	let addOrNew = 'add';
	if (thiefId == 'new') {
		// (new thief, get next thief_id)
		thiefId = (await db.one("SELECT nextval('next_thief_id')"))['nextval'];
		addOrNew = 'add';
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
			try {
				await logHistory({ user_uid: "someUser", changed_thief_id: thiefId, data_type: `${table}`, data: `${delVal}` }, 'delete');
			} catch (err) {
				console.log('Error logging thief history:', err);
				throw err;
			}
		}
		for (let addVal of addVals) {
			if (addVal === '') { continue; }
			insertThiefData(table, thiefId, addVal);
			try {
				await logHistory({ user_uid: "someUser", changed_thief_id: thiefId, data_type: `${table}`, data: `${addVal}` }, addOrNew);
			} catch (err) {
				console.log('Error logging thief history:', err);
				throw err;
			}
		}
	}
	return thiefId;
};

const router = express.Router();
router.get('/', async (req: express.Request, res: express.Response) => {
	try {
		res.json({
			thiefInfo: await get(req.query),
			imageUrls: await getFile(req.query.thiefId as string),
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

router.put('/', upload.array('newImages'), async (req: express.Request, res: express.Response) => {
	try {
		const parsedBody = JSON.parse(req.body.body);
		const thiefId = await put(parsedBody);

		const promises = [];
		if (req.files && req.files.length !== 0) {
			let addOrNew = 'add';
			if (parsedBody.thiefId === 'new') {
				addOrNew = 'new';
			}
			promises.push(uploadImage(req.files as Express.Multer.File[], thiefId, addOrNew));
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
