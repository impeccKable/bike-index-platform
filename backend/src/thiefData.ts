import { db } from './config';

export const fieldToTable: { [key: string]: string } = {
	"name":       "name",
	"email":      "email",
	"url":        "url",
	"addr":       "addr",
	"phone":      "phone",
	"bikeSerial": "bike_serial",
	"phrase":     "phrase",
	"note":       "note",
	"file":				"file"
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
		db.any("SELECT thief_id, file        FROM file        WHERE thief_id in ($1:csv)", [thiefIds]),
	]);
	// Combine results into dictionary of arrays:
	// 	results = {
	// 		name:  [{ thief_id: 1, name: "Alex" }, ...],
	// 		email: [{ thief_id: 1, email: "..." }, ...],
	// 	   ...
	// 	}
	let results: { [key: string]: any[] } = {};
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
		let thief: { [key: string]: any } = {
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
		if (i == 5)  { output = '-'  + output; }
		if (i == 8)  { output = ') ' + output; }
		if (i == 11) { output = ' '  + output; }
		output = digits[i - 1] + output;
		if (i == 10) { output = '(' + output; }
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


// Summary: Takes the content from one thief and merges it into another based on the
//			body arguments under "thiefIdMap". As part of the merge process first a check is made
//			to see if the field from the source thief already exists in the new thief if it does
//			then the field is deleted if not then the field is added to the new location. 
//			Once all fields are merged the source thief is deleted. all updates and deletes are 
//			logged to the console.
// Returns: the remaining thief of the two
//  Params:
//		- 'body': object of thief edit form data
// Remarks:
//		- body.thiefIdMap[0]: thiefID that will go away 
//		- body.thiefIdMap[1]: thiefID recieving new content
export async function MergeThieves(body: any) {
	try {
		console.log(`Merging Thief: ${body.thiefIdMap[0]} into Thief: ${body.thiefIdMap[1]}`);
		Object.entries(fieldToTable).map(async (table)  => {
			// table[1]: name of table/column
			let i = 0;
			//1.  From the current table, query for all rows with the old thief id
			let tableEntries = await db.any(`SELECT thief_id, ${table[1]} FROM ${table[1]} WHERE thief_id = $1`, [`${body.thiefIdMap[0]}`]);
	
			//2.  iterate rows returned if greater than 0 and for each one first check if
			//	  the row already exists for the new id.
			tableEntries.map(async (row:any)=>{
				//row[table[1]]: returns column value of current row.
				console.log(`Table: ${table[1]}, Entry: ${i}, RID: ${row.thief_id}, RVal: ${row[table[1]]}, ${i} of ${tableEntries.length}`);
				++i;
	
				// query for row existng container current id / value pair 
				let isDuplicate = await db.any(`SELECT thief_id, ${table[1]} FROM ${table[1]} WHERE thief_id = $1 AND ${table[1]} = '${row[table[1]]}'`, [body.thiefIdMap[1]]);
				// update if there is no duplicate
				if (isDuplicate.length <= 0) {
					// update
					console.log(`UPDATED Table ${table[1]}. Set thief_id to: '${body.thiefIdMap[1]}' where thief_id was: '${body.thiefIdMap[0]}' and the column '${table[1]}' was '${row[table[1]]}'`);
					await db.any(`UPDATE ${table[1]} SET thief_id = $1 WHERE thief_id = $2 AND ${table[1]} = '${row[table[1]]}'`
					,[body.thiefIdMap[1], body.thiefIdMap[0]]);
				}
				// delete if there is already an entry
				else {
					// delete
					console.log(`DELETED Row from ${table[1]} table where the thief_id was '${body.thiefIdMap[0]}'and the ${table[1]} was '${row[table[1]]}' Because its Duplicate Entry`);
					await db.any(`DELETE FROM ${table[1]} WHERE thief_id = $1 AND ${table[1]} = $2`
					,[body.thiefIdMap[0], row[table[1]]]);
				}
			});
		});
	
		console.log(`DELETED Thief with ID '${[body.thiefIdMap[0]]}'. No Longer Needed After Merge.`);
		// delete old thief entirely
		await db.none(`DELETE FROM thief WHERE thief_id = $1`, [body.thiefIdMap[0]]);
	
		return body.thiefIdMap[1];
	}
	catch (exc) {
			console.log(`[ backend.src.thiefEdit.ts.MergeThieves() ] Error Attempting To Merge Thieves ${body.thiefIdMap[0]} into ${body.thiefIdMap[1]}. Error Message: ${exc}`);
	}
}
