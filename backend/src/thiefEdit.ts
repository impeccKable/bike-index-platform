import express from 'express';
import db from './dbConfig';
import { fieldToTable, fields, thiefInfoByIds } from './thiefInfo';
import { imageUpload, imageDelete } from './imageOperation';
import multer from 'multer';

const upload = multer();

const get = async (query: any) => {
	return thiefInfoByIds([parseInt(query.thiefId)]);
};
const put = async (body: any) => {
	let thiefId = body.thiefId;
	if (thiefId == 'new') {
		// (new thief, get next thief_id)
		thiefId = await db.one("SELECT nextval('next_thief_id')");
	} else {
		thiefId = parseInt(thiefId);
	}
	for (let field of fields) {
		if (!body[field]) {
			continue;
		}
		for (let [oldVal, newVal] of body[field]) {
			let table = fieldToTable[field];
			if (newVal === '') {
				await db.none(
					`DELETE FROM ${table} WHERE thief_id = $1 AND ${table} = $2`,
					[thiefId, oldVal]
				);
			} else if (oldVal === '') {
				await db.none(
					`INSERT INTO ${table} (thief_id, ${table}) VALUES ($1, $2)`,
					[thiefId, newVal]
				);
			} else {
				await db.none(
					`UPDATE ${table} SET ${table} = $1 WHERE thief_id = $2 AND ${table} = $3`,
					[newVal, thiefId, oldVal]
				);
			}
		}
	}

	return thiefId;
};

const router = express.Router();
router.get('/', async (req: express.Request, res: express.Response) => {
	try {
		return res.json(await get(req.query));
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});
router.put('/', upload.array('newImages'), async (req: express.Request, res: express.Response) => {
	try {
		const thiefId = await put(JSON.parse(req.body.body));
		console.log("Returned thiefId", thiefId);
		
		if (req.files && req.files.length !== 0) {
			imageUpload(req.files);
		}
		if (req.body.deletedImages) {
			imageDelete(JSON.parse(req.body.deletedImages));
		}

		res.status(200);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});
export default router;
