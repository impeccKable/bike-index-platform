import express from "express";
import db from "./dbConfig";
import { fieldToTable, thiefInfoByIds } from "./thiefInfo";
import { validToken } from "./token";

// Get matching thief_ids
const get = async (query: any) => {
	let searchType: string = query.searchType;
	let searchText: string = query.searchText;
	let thiefIds: Array<number> = [];
	if (!searchType) {
		return thiefIds;
	}
	let table = fieldToTable[searchType];
	if (table) {
		thiefIds = await db.any(`
			SELECT DISTINCT thief_id
			FROM ${table}
			WHERE ${table} ILIKE $1
			ORDER BY thief_id DESC
		`, [`%${searchText}%`]);
		let resultCnt = thiefIds.length;

	} else {
		throw new Error(`Unknown search type: ${query.searchType}`);
	}
	thiefIds = thiefIds.map((obj: any) => obj.thief_id);
	return await thiefInfoByIds(thiefIds);
}

const router = express.Router();
router.get("/", async (req: express.Request, res: express.Response) => {
	try {
		// if (!validToken(req)) {
		// return res.status(401).send("Unauthorized");
		// }
		return res.json(await get(req.query));
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});
export default router;
