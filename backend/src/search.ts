import express from "express";
import db from "./dbConfig";
import { fieldToTable, thiefInfoByIds } from "./thiefInfo";
import { validToken } from "./token";

const MAX_ROW = 10;

export const searchableTable: { [key: string]: string } = {
	"name": "name",
	"email": "email",
	"url": "url",
	"addr": "addr",
	"phone": "phone",
};

// Get matching thief_ids
const get = async (query: any) => {
	let { searchType, searchText, page = 1 } = query;
	//  keep track of scores (counts) for each thief_id
	const scores: Map<number, number> = new Map();
	const offset = (page - 1) * MAX_ROW;
	const isSearchTextValid = searchText && searchText.trim() !== "";

	if (!searchType) {
		return [];
	}


	const queryForTable = (table: string) => {
		return `
			SELECT thief_id, COUNT(thief_id) as count
			FROM ${table}
			${isSearchTextValid ? `WHERE ${table} ILIKE $1` : ""}
			GROUP BY thief_id`;
	};

	const getScores = async (table: string) => {
		try {
			const params = isSearchTextValid ? [`%${searchText}%`] : [];
			const result = await db.any(queryForTable(table), params);
			// update the scores map with counts, add to the existing count if it exists
			result.forEach((item: any) => {
				scores.set(item.thief_id, (scores.get(item.thief_id) || 0) + item.count);
			});
		} catch (err) {
			console.error(`Error querying table ${table}`, err);
		};
	}

	if (searchType === "all") {
		await Promise.all(Object.values(searchableTable).map(getScores));
	} else {
		const table = fieldToTable[searchType];
		if (!table) {
			throw new Error(`Unknown search type: ${query.searchType}`);
		}
		await getScores(table);
	}

	const allThiefIds = Array.from(scores.keys());
	if (isSearchTextValid) {
		allThiefIds.sort((a, b) => (scores.get(b) || 0) - (scores.get(a) || 0));
	} else {
		allThiefIds.sort((a, b) => b - a);
	}
	const pagedThiefIds = allThiefIds.slice(offset, offset + MAX_ROW);

	const total = allThiefIds.length;

	return {
		data: await thiefInfoByIds(pagedThiefIds),
		meta: {
			totalRows: total,
			totalPages: Math.ceil(total / MAX_ROW)
		}
	};
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
