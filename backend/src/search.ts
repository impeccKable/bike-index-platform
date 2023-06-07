import express from "express";
import db from "./dbConfig";
import { fieldToTable, thiefInfoByIds } from "./thiefInfo";

// Get matching thief_ids
const get = async (query: any) => {
	let searchType: string = query.searchType;
	let search: string = query.search;
	let thiefIds: Array<number> = [];
	if (!searchType || !search) {
		return thiefIds; // TODO: return most recent thieves
	}
	let table = fieldToTable[searchType];
	if (table === "addr") {
		thiefIds = await db.any(`
			SELECT thief_id
			FROM addr
			WHERE line1 ILIKE $1
				OR line2 ILIKE $1
				OR city  ILIKE $1
				OR state ILIKE $1
				OR zip   ILIKE $1
		`, [`%${search}%`]);

	} else if (table) {
		thiefIds = await db.any(`
			SELECT thief_id
			FROM ${table}
			WHERE ${table} ILIKE $1
		`, [`%${search}%`]);

	} else {
		throw new Error(`Unknown search type: ${query.searchType}`);
	}
	thiefIds = thiefIds.map((obj: any) => obj.thief_id);
	return await thiefInfoByIds(thiefIds);
}

const router = express.Router();
router.get("/", async (req: express.Request, res: express.Response) => {
	try {
		return res.json(await get(req.query));
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});
export default router;
