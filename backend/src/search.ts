import express from "express";
import db from "./dbConfig";

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

	// Get thief info
	let tableNames = ["name", "email", "url", "addr", "phone", "bike_serial", "phrase", "note"];
	let dictNames  = ["name", "email", "url", "addr", "phone", "bikeSerial", "phrase", "note"];
	let values = await Promise.all([
		db.any("SELECT thief_id, name        FROM name                    WHERE thief_id in ($1:csv)", [thiefIds]),
		db.any("SELECT thief_id, email       FROM email                   WHERE thief_id in ($1:csv)", [thiefIds]),
		db.any("SELECT thief_id, url         FROM url                     WHERE thief_id in ($1:csv)", [thiefIds]),
		db.any("SELECT thief_id, line1, line2, city, state, zip FROM addr WHERE thief_id in ($1:csv)", [thiefIds]),
		db.any("SELECT thief_id, phone       FROM phone                   WHERE thief_id in ($1:csv)", [thiefIds]),
		db.any("SELECT thief_id, bike_serial FROM bike_serial             WHERE thief_id in ($1:csv)", [thiefIds]),
		db.any("SELECT thief_id, phrase      FROM phrase                  WHERE thief_id in ($1:csv)", [thiefIds]),
		db.any("SELECT thief_id, note        FROM note                    WHERE thief_id in ($1:csv)", [thiefIds]),
	]);
	let results: {[key: string]: Array<any>} = {};
	for (let i = 0; i < dictNames.length; i++) {
		results[dictNames[i]] = values[i];
	}

	// Format results
	let thieves: any = [];
	for (let i = 0; i < thiefIds.length; i++) {
		let thiefId = thiefIds[i];
		let thief: {[key: string]: Array<any>} = {
			thiefId: thiefId,
		};
		for (let j = 0; j < dictNames.length; j++) {
			// Isolate results for this thief
			thief[dictNames[j]] = results[dictNames[j]].filter(
				(result: any) => result.thief_id === thiefId
			);
			if (dictNames[j] === "addr") {
				// Take out null values and thief_id
				thief[dictNames[j]] = thief[dictNames[j]].map(
					(currAddr: any) => {
						for (let key in currAddr) {
							if (currAddr[key] === null || key === "thief_id") {
								delete currAddr[key];
							}
						}
						return currAddr;
					}
				);
			} else {
				// Convert to array of strings (from array of objects)
				thief[dictNames[j]] = thief[dictNames[j]].map(
					(result: any) => result[tableNames[j]]
				);
			}
		}
		thieves.push(thief);
	}
	return thieves;
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
