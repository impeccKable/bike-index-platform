// import express from "express";
// import db from "./dbConfig";
// import { thiefInfoByIds } from "./thiefEdit";
// import { withLowercaseKeys } from "./util";
// import { parse } from 'csv-parse';

// // load data from csv into database
// const load = async (req: express.Request, res: express.Response) => {
// 	let csvData = req.body;
// 	let thiefIds: Array<number> = [];

// 	// convert line endings to unix format
// 	csvData = csvData.replace(`\r\n`, `\n`);
// 	csvData = csvData.split(`\n`).map((row: string) => {
// 		let cols = row.split(`,`);
// 		return {
// 			name:       cols[0],
// 			email:      cols[1],
// 			url:        cols[2],
// 			phone:      cols[3],
// 			bikeSerial: cols[4],
// 			phrase:     cols[5],
// 			note:       cols[6],
// 			addr: {
// 				line1: cols[7],
// 				line2: cols[8],
// 				city:  cols[9],
// 				state: cols[10],
// 				zip:   cols[11],
// 			},
// 		};
// 	});

// 	// iterate over csv data rows
// 	for (let row of csvData) {
// 		let thiefId: number = await db.one(`
// 			INSERT INTO thief (created)
// 			VALUES (NOW())
// 			RETURNING id
// 		`);
// 		thiefId = thiefId.id;
// 		thiefIds.push(thiefId);
// 		// iterate over columns in row
// 		for (let col in row) {
// 			let table = withLowercaseKeys(searchTypeToTable)[col];
// 			if (table) {
// 				let value = row[col];
// 				if (value) {
// 					await db.none(`
// 						INSERT INTO ${table} (thief_id, ${table})
// 						VALUES ($1, $2)
// 					`, [thiefId, value]);
// 				}
// 			}
// 		}
// 	}
// }

// const router = express.Router();
// router.post("/", async (req: express.Request, res: express.Response) => {
// 	try {
// 		return res.json(await load(req, res));
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500);
// 	}
// });
// export default router;
