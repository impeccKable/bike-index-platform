import express from 'express';
import db from './dbConfig';
import { fieldToTable, fields, thiefInfoByIds } from './thiefInfo';

const insertField = async (table: string, thiefId: number, newVal: any) => {
	if (table === 'addr') {
		await db.none(
			`INSERT INTO ${table} (thief_id, line1, line2, city, state, zip) VALUES ($1, $2, $3, $4, $5, $6)`,
			[
				thiefId,
				newVal.line1,
				newVal.line2,
				newVal.city,
				newVal.state,
				newVal.zip,
			]
		);
	} else {
		await db.none(`INSERT INTO ${table} (thief_id, ${table}) VALUES ($1, $2)`, [
			thiefId,
			newVal,
		]);
	}
};
const deleteField = async (table: string, thiefId: number, oldVal: any) => {
	if (table === 'addr') {
		await db.none(
			`DELETE FROM ${table} WHERE thief_id = $1 AND line1 = $2 AND line2 = $3 AND city = $4 AND state = $5 AND zip = $6`,
			[
				thiefId,
				oldVal.line1,
				oldVal.line2,
				oldVal.city,
				oldVal.state,
				oldVal.zip,
			]
		);
	} else {
		await db.none(
			`DELETE FROM ${table} WHERE thief_id = $1 AND ${table} = $2`,
			[thiefId, oldVal]
		);
	}
};
const updateField = async (
	table: string,
	thiefId: number,
	oldVal: any,
	newVal: any
) => {
	if (table === 'addr') {
		await db.none(
			`UPDATE ${table} SET line1 = $1, line2 = $2, city = $3, state = $4, zip = $5
			WHERE thief_id = $6 AND line1 = $7 AND line2 = $8 AND city = $9 AND state = $10 AND zip = $11`,
			[
				newVal.line1,
				newVal.line2,
				newVal.city,
				newVal.state,
				newVal.zip,
				thiefId,
				oldVal.line1,
				oldVal.line2,
				oldVal.city,
				oldVal.state,
				oldVal.zip,
			]
		);
	} else {
		await db.none(
			`UPDATE ${table} SET ${table} = $1 WHERE thief_id = $2 AND ${table} = $3`,
			[newVal, thiefId, oldVal]
		);
	}
};

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
			if (oldVal === '0') {
				await insertField(fieldToTable[field], thiefId, newVal);
			} else if (newVal === '0') {
				await deleteField(fieldToTable[field], thiefId, oldVal);
			} else {
				await updateField(fieldToTable[field], thiefId, oldVal, newVal);
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
