import { db } from './config';

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
export const tables = Object.values(fieldToTable);

export async function getThiefData(thiefIds: number[]) {
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

function standardizePhoneNum(text: string): string {
	// only keep digits, reverse order
	let digits = text.replace(/\D/g, '').split('').reverse().join('');
	let output = '';
	let i;
	for (i = 1; i <= digits.length; i++) { // 1-based index
		if (i == 5 ) { output = '-'  + output; }
		if (i == 8 ) { output = ') ' + output; }
		if (i == 11) { output = ' '  + output; }
		output = digits[i-1] + output;
		if (i == 10) { output = '('  + output; }
	}
	if (i == 9 || i == 10) { output = '(' + output; }
	if (i >= 12) { output = '+' + output; }
	return output;
}

// Returns true if the data was updated, false if the data already existed
export async function insertThiefData(table: string, thiefId: string, newVal: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		if (table === 'phone') {
			newVal = standardizePhoneNum(newVal);
		}
		db.none(`INSERT INTO ${table} VALUES ($1, $2);`, [thiefId, newVal])
			.then(() => resolve(true))
			.catch((err: any) => {
				// duplicate primary key constraint
				if (err.code === '23505') { resolve(false); }
				else { reject(err); }
			});
	});
}

export async function deleteThiefData(table: string, thiefId: string, oldVal: string): Promise<void> {
	return new Promise((resolve, reject) => {
		db.none(`DELETE FROM ${table} WHERE thief_id = $1 AND ${table} = $2`, [thiefId, oldVal])
			.then(() => resolve());
	});
}

