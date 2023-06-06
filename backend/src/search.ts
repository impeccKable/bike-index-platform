import express from "express";
import db from "./dbConfig";

import { thiefInfoByIds } from "./thiefedit";

const searchTypeToTable: {[key: string]: string} = {
	'name':       'name',
	'email':      'email',
	'url':        'url',
	'phone':      'phone',
	'bikeSerial': 'bike_serial',
	'phrase':     'phrase',
	'note':       'note',
};

const get = async (searchType: string, search: string) => {
	// Get matching thief_ids
	let thiefIds = [];
	if (!searchType || !search) {
		return []; // TODO: return most recent thieves

	} else if (searchTypeToTable[searchType]) {
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
				OR city LIKE $1
				OR state LIKE $1
				OR zip LIKE $1
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
		return res.json(await get(
			req.query.searchType as string,
			req.query.search     as string
		));
	} catch (err) {
		console.error(err);
		res.status(500).send("Error getting stats from db");
	}
});
export default router;
