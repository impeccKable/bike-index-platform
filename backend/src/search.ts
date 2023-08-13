import express from "express";
import db from "./dbConfig";
import { fieldToTable, thiefInfoByIds } from "./thiefInfo";
import { validToken } from "./token";

// Get matching thief_ids
async function get(query: any) {
	let searchType: string = query.searchType;
	let searchText: string = query.searchText;
	let thiefIds: Array<number> = [];
	if (!searchType) {
		return thiefIds;
	}
	if (searchType === "all") {
		let matchWeights: { [key: string]: number } = {
			'name':        1.0,
			'email':       0.5,
			'url':         0.05,
			'addr':        0.75,
			'phone':       1.0,
			'bike_serial': 0.3,
			'phrase':      0.2,
			'note':        0.1,
		};

		// Start search queries
		let promises = [];
		for (let table in matchWeights) {
			promises.push(db.any(`
				SELECT DISTINCT thief_id
				FROM ${table}
				WHERE ${table} ILIKE $1
				ORDER BY thief_id DESC
			`, [`%${searchText}%`]));
		}

		// Accumulate match amounts
		let matchAmts: { [key: number]: number } = {};
		let tables = Object.keys(matchWeights);
		for (let i = 0; i < promises.length; i++) {
			let thiefIds = (await promises[i]).map((obj: any) => obj.thief_id);
			for (let thiefId of thiefIds) {
				if (!matchAmts[thiefId]) {
					matchAmts[thiefId] = 0;
				}
				matchAmts[thiefId] += matchWeights[tables[i]];
			}
		}
		// (also match thief_id directly)
		let id = parseInt(searchText);
		if (id) {
			if (!matchAmts[id]) {
				matchAmts[id] = 0;
			}
			matchAmts[id] += 2.0;
		}

		// Sort by match amount
		let matchAmtsArr: Array<[number, number]> = [];
		for (let thiefId in matchAmts) {
			matchAmtsArr.push([parseInt(thiefId), matchAmts[thiefId]]);
		}
		matchAmtsArr.sort((a, b) => b[1] - a[1]);
		thiefIds = matchAmtsArr.map((arr) => arr[0]);
		thiefIds.sort((a, b) => b - a);
	} else { // searchType is a field
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
	}
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
