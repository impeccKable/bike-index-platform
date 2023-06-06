import express from "express";
import db from "./dbConfig";
import { thiefInfoByIds } from "./thiefedit";
import { withLowercaseKeys } from "./util";

const searchTypeToTable: {[key: string]: string} = {
	'name':       'name',
	'email':      'email',
	'url':        'url',
	'phone':      'phone',
	'bikeSerial': 'bike_serial',
	'phrase':     'phrase',
	'note':       'note',
};

// Get matching thief_ids
const get = async (query: any) => {
	query = withLowercaseKeys(query);
	let searchType: string = query.searchtype;
	let search: string = query.search;
	let thiefIds = [];
	if (!searchType || !search) {
		return []; // TODO: return most recent thieves
	}
	searchType = searchType.toLowerCase();
	search = search.toLowerCase();
	if (searchTypeToTable[searchType]) {
		thiefIds = await db.any(`
			SELECT thief_id
			FROM ${searchTypeToTable[searchType]}
			WHERE ${searchType} LIKE $1
		`, [`%${search}%`]);

	} else if (searchType === 'addr') {
		thiefIds = await db.any(`
			SELECT thief_id
			FROM addr
			WHERE line1 LIKE $1
				OR line2 LIKE $1
				OR city  LIKE $1
				OR state LIKE $1
				OR zip   LIKE $1
		`, [`%${search}%`]);

	} else {
		return []; // TODO: throw error, unknown search type
	}
	thiefIds = thiefIds.map((thiefId: any) => thiefId.thief_id);
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
