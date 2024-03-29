import express from 'express';
import { db } from '../config';
import { fieldToTable, fields, getThiefData, MergeThieves } from '../thiefData';
import { uploadFile, deleteFile, getFile, FileUploadError, FileDeletionError, FileGetError } from '../fileOperation';
import multer from 'multer';
import { insertThiefData, deleteThiefData } from '../thiefData';
import { logHistory } from './history';
import { validToken } from './token';

const upload = multer();

async function get(query: any) {
	return getThiefData([parseInt(query.thiefId)]);
};

async function put(body: any, uid: string) {
	let addOrNew = 'add';
	let thiefId = body.thiefId;
	if (thiefId == 'new') {
		// (new thief, get next thief_id)
		thiefId = (await db.one("SELECT nextval('next_thief_id')"))['nextval'];
		addOrNew = 'new';
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
			try {
				await logHistory({ user_uid: uid, changed_thief_id: thiefId, data_type: `${table}`, data: `${delVal}` }, 'delete');
			} catch (err) {
				console.log('Error logging thief history:', err);
				throw err;
			}
		}
		for (let addVal of addVals) {
			if (addVal === '') { continue; }
			insertThiefData(table, thiefId, addVal);
			try {
				await logHistory({ user_uid: uid, changed_thief_id: thiefId, data_type: `${table}`, data: `${addVal}` }, addOrNew);
			} catch (err) {
				console.log('Error logging thief history:', err);
				throw err;
			}
		}
	}
	return thiefId;
}

const router = express.Router();
router.get('/', async (req: express.Request, res: express.Response) => {
	try {
		res.json({
			thiefInfo: await get(req.query),
			imageUrls: await getFile(req.query.thiefId as string),
		});
	} catch (err) {
		if (err instanceof FileGetError) {
			console.log('File Get Error', err);
			res.status(400).send("Error getting file");
		} else {
			console.error('thiefEdit get error', err);
			res.status(500);
		}
	}
});

router.put('/', upload.array('newImages'), async (req: express.Request, res: express.Response) => {
	try {
		const uid: string = await validToken(req);
		const parsedBody = JSON.parse(req.body.body);
		const thiefId = await put(parsedBody, uid);

		const promises = [];
		if (req.files && req.files.length !== 0) {
			let addOrNew = 'add';
			if (parsedBody.thiefId === 'new') {
				addOrNew = 'new';
			}
			promises.push(uploadFile(req.files as Express.Multer.File[], thiefId, addOrNew, uid));
		}
		if (req.body.deletedImages) {
			promises.push(deleteFile(JSON.parse(req.body.deletedImages), thiefId, uid));
		}
		await Promise.all(promises);

		res.status(200).json({ thiefId });
	} catch (err) {
		if (err instanceof FileUploadError) {
			console.error('File upload error', err);
			res.status(422).send("Error uploading file");
		} else if (err instanceof FileDeletionError) {
			console.error('File delete error', err);
			res.status(422).send("Error deleting file");
		} else {
			console.error('thiefEdit put error', err);
			res.status(500).send("Internal server error")
		}
	}
});
export default router;
