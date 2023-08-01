import express from 'express';
import db from './dbConfig';
import { fieldToTable, fields, thiefInfoByIds } from './thiefInfo';

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
router.put('/', async (req: express.Request, res: express.Response) => {
	try {
		await put(req.body);
		res.status(200);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});
export default router;
