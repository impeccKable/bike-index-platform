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
	let thiefIds: Array<number> = [];
	if (!searchType || !search) {
		return thiefIds; // TODO: return most recent thieves
	}
	searchType = searchType.toLowerCase();
	search = search.toLowerCase();
	let table = withLowercaseKeys(searchTypeToTable)[searchType];
	if (table) {
		thiefIds = await db.any(`
			SELECT thief_id
			FROM ${table}
			WHERE lower(${table}) LIKE $1
		`, [`%${search}%`]);

	} else if (searchType === 'addr') {
		thiefIds = await db.any(`
			SELECT thief_id
			FROM addr
			WHERE lower(line1) LIKE $1
				OR lower(line2) LIKE $1
				OR lower(city)  LIKE $1
				OR lower(state) LIKE $1
				OR lower(zip)   LIKE $1
		`, [`%${search}%`]);

	} else {
		throw new Error(`Unknown search type: ${query.searchtype}`);
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
