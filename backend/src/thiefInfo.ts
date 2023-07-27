import db from "./dbConfig";

export const fieldToTable: {[key: string]: string} = {
	"name":       "name",
	"email":      "email",
	"url":        "url",
	"addr":       "addr",
	"phone":      "phone",
	"bikeSerial": "bike_serial",
	"phrase":     "phrase",
	"note":       "note",
};
export const fields = Object.keys(fieldToTable);

export const thiefInfoByIds = async (thiefIds: number[]) => {
	if (thiefIds.length === 0) {
		return [];
	}
	// Get info from database
	let values = await Promise.all([
		db.any("SELECT thief_id, name        FROM name        WHERE thief_id in ($1:csv)", [thiefIds]),
		db.any("SELECT thief_id, email       FROM email       WHERE thief_id in ($1:csv)", [thiefIds]),
		db.any("SELECT thief_id, url         FROM url         WHERE thief_id in ($1:csv)", [thiefIds]),
		db.any("SELECT thief_id, addr        FROM addr        WHERE thief_id in ($1:csv)", [thiefIds]),
		db.any("SELECT thief_id, phone       FROM phone       WHERE thief_id in ($1:csv)", [thiefIds]),
		db.any("SELECT thief_id, bike_serial FROM bike_serial WHERE thief_id in ($1:csv)", [thiefIds]),
		db.any("SELECT thief_id, phrase      FROM phrase      WHERE thief_id in ($1:csv)", [thiefIds]),
		db.any("SELECT thief_id, note        FROM note        WHERE thief_id in ($1:csv)", [thiefIds]),
	]);
	// Combine results into dictionary of arrays:
	// 	results = {
	// 		name:  [{ thief_id: 1, name: "Alex" }, ...],
	// 		email: [{ thief_id: 1, email: "..." }, ...],
	// 	   ...
	// 	}
	let results: {[key: string]: any[]} = {};
	for (let i = 0; i < fields.length; i++) {
		results[fields[i]] = values[i];
	}

	// Extract info into array of thieves:
	// 	thieves = [
	// 		{ thiefId: 1, name: ["William", "Will"], ... },
	// 		...
	// 	]
	let thieves: any = [];
	for (let thiefId of thiefIds) {
		// Construct the thief object
		let thief: {[key: string]: any} = {
			thiefId: thiefId,
		};
		for (let field of fields) {
			// Isolate results for this thief
			thief[field] = results[field].filter(
				(result: any) => result.thief_id === thiefId
			);
			// Convert to array of strings (from array of objects)
			//   as the format from the database is like this:
			//   { thief_id: 1, name: "Alex" }
			thief[field] = thief[field].map(
				(result: any) => result[fieldToTable[field]]
			);
		}
		thieves.push(thief);
	}
	return thieves;
}
