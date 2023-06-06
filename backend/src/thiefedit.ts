import express from "express";
import db from "./dbConfig";

const tableNames = ["name", "email", "url", "addr", "phone", "bike_serial", "phrase", "note"];
const dictNames = ["name", "email", "url", "addr", "phone", "bikeSerial", "phrase", "note"];

export const thiefInfoByIds = async (thiefIds: Array<number>) => {
	// Get thief info
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
		let thief: {[key: string]: any} = {
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

const insertField = async (table: string, thiefId: number, newVal: any) => {
	if (table === "addr") {
		await db.none(
			`INSERT INTO ${table} (thief_id, line1, line2, city, state, zip) VALUES ($1, $2, $3, $4, $5, $6)`,
			[ thiefId, newVal.line1, newVal.line2, newVal.city, newVal.state, newVal.zip ]
		);
	} else {
		await db.none(
			`INSERT INTO ${table} (thief_id, ${table}) VALUES ($1, $2)`,
			[thiefId, newVal]
		);
	}
}
const deleteField = async (table: string, thiefId: number, oldVal: any) => {
	if (table === "addr") {
		await db.none(
			`DELETE FROM ${table} WHERE thief_id = $1 AND line1 = $2 AND line2 = $3 AND city = $4 AND state = $5 AND zip = $6`,
			[ thiefId, oldVal.line1, oldVal.line2, oldVal.city, oldVal.state, oldVal.zip ]
		);
	} else {
		await db.none(
			`DELETE FROM ${table} WHERE thief_id = $1 AND ${table} = $2`,
			[thiefId, oldVal]
		);
	}
}
const updateField = async (table: string, thiefId: number, oldVal: any, newVal: any) => {
	if (table === "addr") {
		await db.none(
			`UPDATE ${table}
			SET line1 = $1, line2 = $2, city = $3, state = $4, zip = $5
			WHERE thief_id = $6 AND line1 = $7 AND line2 = $8 AND city = $9 AND state = $10 AND zip = $11`,
			[
				newVal.line1, newVal.line2, newVal.city, newVal.state, newVal.zip,
				thiefId,
				oldVal.line1, oldVal.line2, oldVal.city, oldVal.state, oldVal.zip
			]
		);
	} else {
		await db.none(
			`UPDATE ${table} SET ${table} = $1 WHERE thief_id = $2 AND ${table} = $3`,
			[newVal, thiefId, oldVal]
		);
	}
}

const put = async (body: any) => {
	let thiefId = body.thiefId;
	if (thiefId == "new") {
		thiefId = await db.one("SELECT nextval('next_thief_id')");
	} else {
		thiefId = parseInt(thiefId);
	}
	for (let i = 0; i < dictNames.length; i++) {
		if (body[dictNames[i]]) {
			for (let j = 0; j < body[dictNames[i]].length; j++) {
				let oldVal = body[dictNames[i]][j][0];
				let newVal = body[dictNames[i]][j][1];
				if (oldVal === 0) {
					insertField(tableNames[i], thiefId, newVal);
				} else if (newVal === 0) {
					deleteField(tableNames[i], thiefId, oldVal);
				} else {
					updateField(tableNames[i], thiefId, oldVal, newVal);
				}
			}
		}
	}
}

const router = express.Router();
router.get("/", async (req: express.Request, res: express.Response) => {
	try {
		return res.json(await thiefInfoByIds([parseInt(req.query.thiefId as string)]));
	} catch (err) {
		console.error(err);
		res.status(500)
	}
});
router.put("/", async (req: express.Request, res: express.Response) => {
	try {
		await put(req.body);
		res.status(200);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});
export default router;
































// import express from "express";
// import db from "./dbConfig";

// // request:
// // {
// // 	'thief_id': 3
// // }
// // response:
// // {
// // 	'name': ['name1', 'name2'], # all names for the thief
// // 			'email': ['email1']
// // 	// everything else about the thief
// // }
// const tableNames = ["name", "email", "url", "addr", "phone", "bike_serial", "phrase", "note"];
// const dictNames = ["name", "email", "url", "addr", "phone", "bikeSerial", "phrase", "note"];

// export const thiefInfoByIds = async (thiefIds: Array<number>) => {
// 	// Get thief info
// 	let values = await Promise.all([
// 		db.any("SELECT thief_id, name        FROM name                    WHERE thief_id in ($1:csv)", [thiefIds]),
// 		db.any("SELECT thief_id, email       FROM email                   WHERE thief_id in ($1:csv)", [thiefIds]),
// 		db.any("SELECT thief_id, url         FROM url                     WHERE thief_id in ($1:csv)", [thiefIds]),
// 		db.any("SELECT thief_id, line1, line2, city, state, zip FROM addr WHERE thief_id in ($1:csv)", [thiefIds]),
// 		db.any("SELECT thief_id, phone       FROM phone                   WHERE thief_id in ($1:csv)", [thiefIds]),
// 		db.any("SELECT thief_id, bike_serial FROM bike_serial             WHERE thief_id in ($1:csv)", [thiefIds]),
// 		db.any("SELECT thief_id, phrase      FROM phrase                  WHERE thief_id in ($1:csv)", [thiefIds]),
// 		db.any("SELECT thief_id, note        FROM note                    WHERE thief_id in ($1:csv)", [thiefIds]),
// 	]);
// 	let results: { [key: string]: Array<any> } = {};
// 	for (let i = 0; i < dictNames.length; i++) {
// 		results[dictNames[i]] = values[i];
// 	}

// 	// Format results
// 	let thieves: any = [];
// 	for (let i = 0; i < thiefIds.length; i++) {
// 		let thiefId = thiefIds[i];
// 		let thief: { [key: string]: any } = {
// 			thiefId: thiefId,
// 		};
// 		for (let j = 0; j < dictNames.length; j++) {
// 			// Isolate results for this thief
// 			thief[dictNames[j]] = results[dictNames[j]].filter(
// 				(result: any) => result.thief_id === thiefId
// 			);
// 			if (dictNames[j] === "addr") {
// 				// Take out null values and thief_id
// 				thief[dictNames[j]] = thief[dictNames[j]].map(
// 					(currAddr: any) => {
// 						for (let key in currAddr) {
// 							if (currAddr[key] === null || key === "thief_id") {
// 								delete currAddr[key];
// 							}
// 						}
// 						return currAddr;
// 					}
// 				);
// 			} else {
// 				// Convert to array of strings (from array of objects)
// 				thief[dictNames[j]] = thief[dictNames[j]].map(
// 					(result: any) => result[tableNames[j]]
// 				);
// 			}
// 		}
// 		thieves.push(thief);
// 	}
// 	return thieves;
// }

// const post = async (body: any) => {
// 	let thiefId = parseInt(body.thiefId);
// 	if (thiefId == "new") {
// 		thiefId = await db.one("SELECT nextval('next_thief_id')");
// 	}
// 	for (let i = 0; i < dictNames.length; i++) {
// 		if (body[dictNames[i]]) {
// 			for (let j = 0; j < body[dictNames[i]].length; j++) {
// 				if (dictNames[i] === "addr") {
// 					// TODO: What if not all address fields are present?
// 					await db.none(
// 						`INSERT INTO ${tableNames[i]} (thief_id, line1, line2, city, state, zip) VALUES ($1, $2, $3, $4, $5, $6)`,
// 						[
// 							thiefId,
// 							body[dictNames[i]][j].line1,
// 							body[dictNames[i]][j].line2,
// 							body[dictNames[i]][j].city,
// 							body[dictNames[i]][j].state,
// 							body[dictNames[i]][j].zip
// 						]
// 					);
// 				} else {
// 					await db.none(
// 						`INSERT INTO ${tableNames[i]} (thief_id, ${tableNames[i]}) VALUES ($1, $2)`,
// 						[thiefId, body[dictNames[i]][j]]
// 					);
// 				}
// 			}
// 		}
// 	}
// }

// const remove = async (body: any) => {
// 	let thiefId = parseInt(body.thiefId);
// 	for (let i = 0; i < dictNames.length; i++) {
// 		if (body[dictNames[i]]) {
// 			for (let j = 0; j < body[dictNames[i]].length; j++) {
// 				if (dictNames[i] === "addr") {
// 					// TODO: What if not all address fields are present?
// 					await db.none(
// 						`DELETE FROM ${tableNames[i]} WHERE thief_id = $1 AND line1 = $2 AND line2 = $3 AND city = $4 AND state = $5 AND zip = $6`,
// 						[
// 							thiefId,
// 							body[dictNames[i]][j].line1,
// 							body[dictNames[i]][j].line2,
// 							body[dictNames[i]][j].city,
// 							body[dictNames[i]][j].state,
// 							body[dictNames[i]][j].zip
// 						]
// 					);
// 				} else {
// 					await db.none(
// 						`DELETE FROM ${tableNames[i]} WHERE thief_id = $1 AND ${tableNames[i]} = $2`,
// 						[thiefId, body[dictNames[i]][j]]
// 					);
// 				}
// 			}
// 		}
// 	}
// }
// //
// // // Updates (PUT)
// // // /thiefedit
// // 	{
// // 		'thief_id': 3
// // 		'name': [
// // 			// old val, new val
// // 			['name3', 'name3a'], // update
// // 		],
// // 		'address': [
// // 			// old val, new val
// // 			[{
// // 				line1: 'line1',
// // 				line2: 'line2',
// // 				city:  'city',
// // 				state: 'state',
// // 				zip:   'zip',
// // 			}, {
// // 				line1: 'line1 new',
// // 				line2: 'line2 new',
// // 				city:  'city new',
// // 				state: 'state new',
// // 				zip:   'zip new',
// // 			}], // update
// // 		],
// // 	}

// const update = async (body: any) => {
// 	let thiefId = parseInt(body.thiefId);
// 	for (let i = 0; i < dictNames.length; i++) {
// 		if (body[dictNames[i]]) {
// 			for (let j = 0; j < body[dictNames[i]].length; j++) {
// 				if (dictNames[i] === "addr") {
// 					await db.none(
// 						`UPDATE ${tableNames[i]}
// 						SET line1 = $1, line2 = $2, city = $3, state = $4, zip = $5
// 						WHERE thief_id = $6 AND line1 = $7 AND line2 = $8 AND city = $9 AND state = $10 AND zip = $11`,
// 						[
// 							body[dictNames[i]][j][1].line1,
// 							body[dictNames[i]][j][1].line2,
// 							body[dictNames[i]][j][1].city,
// 							body[dictNames[i]][j][1].state,
// 							body[dictNames[i]][j][1].zip,
// 							thiefId,
// 							body[dictNames[i]][j][0].line1,
// 							body[dictNames[i]][j][0].line2,
// 							body[dictNames[i]][j][0].city,
// 							body[dictNames[i]][j][0].state,
// 							body[dictNames[i]][j][0].zip
// 						]
// 					);
// 				} else {
// 					await db.none(
// 						`UPDATE ${tableNames[i]} SET ${tableNames[i]} = $1 WHERE thief_id = $2 AND ${tableNames[i]} = $3`,
// 						[body[dictNames[i]][j][1], thiefId, body[dictNames[i]][j][0]]
// 					);
// 				}
// 			}
// 		}
// 	}
// }

// const router = express.Router();
// router.get("/", async (req: express.Request, res: express.Response) => {
// 	try {
// 		return res.json(await thiefInfoByIds([parseInt(req.query.thiefId as string)]));
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500)
// 	}
// });
// router.post("/", async (req: express.Request, res: express.Response) => {
// 	try {
// 		await post(req.body);
// 		res.status(200);
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500);
// 	}
// });
// router.delete("/", async (req: express.Request, res: express.Response) => {
// 	try {
// 		await remove(req.body);
// 		res.status(200);
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500);
// 	}
// });
// router.put("/", async (req: express.Request, res: express.Response) => {
// 	try {
// 		await update(req.body);
// 		res.status(200);
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500);
// 	}
// });
// export default router;
