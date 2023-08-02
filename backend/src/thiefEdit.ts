import express from 'express';
import db from './dbConfig';
import { fieldToTable, fields, thiefInfoByIds } from './thiefInfo';
import { uploadImage, deleteImage, getImage, ImageUploadError, ImageDeletionError, ImageGetError} from './imageOperation';
import multer from 'multer';

const upload = multer();

const get = async (query: any) => {
	return thiefInfoByIds([parseInt(query.thiefId)]);
};
const put = async (body: any) => {
	let thiefId = body.thiefId;
	if (thiefId == 'new') {
		// (new thief, get next thief_id)
		thiefId = (await db.one("SELECT nextval('next_thief_id')"))['nextval'];
	}
	thiefId = parseInt(thiefId);
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
		return res.json({
			thiefInfo: await get(req.query),
			imageUrls: await getImage(req.query.thiefId as string),
		});
	} catch (err) {
		if (err instanceof ImageGetError) {
			console.error(err);
			res.status(400).send("Error getting image");
		}
		console.error(err);
		res.status(500);
	}
});
router.put('/', upload.array('newImages'), async (req: express.Request, res: express.Response) => {
	try {
		const thiefId = await put(JSON.parse(req.body.body));

		let promises = [];
		if (req.files && req.files.length !== 0) {
			promises.push(uploadImage(req.files as Express.Multer.File[], thiefId));
		}
		if (req.body.deletedImages) {
			promises.push(deleteImage(JSON.parse(req.body.deletedImages)));
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
