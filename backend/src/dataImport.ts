import express from "express";
import csv from "csv-parse/sync";
import fs from "fs";

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
import db from './dbConfig';

let columnToTable = [ 'thief_id', 'name', 'email', 'url', 'addr', 'phone', 'bike_serial', 'phrase', 'note', ];

const processFile = (req: any) => {
	let newDataCnts: any = { 'thief': 0, 'name': 0, 'email': 0, 'url': 0, 'addr': 0, 'phone': 0, 'bike_serial': 0, 'phrase': 0, 'note': 0, };

	const tryInsertRow = async (table: string, thief_id: string, val: string) => {
		try {
			await db.none(`INSERT INTO ${table} VALUES ($1, $2);`, [thief_id, val]);
			newDataCnts[table]++;
		} catch (err: any) {
			// duplicate primary key constraint
			if (err.code === '23505') {
				return;
			}
			else { throw err; }
		}
	};

	return new Promise(async (resolve, reject) => {
		const fileContents = fs.readFileSync(req.file.path, 'utf8');
		const rows = csv.parse(fileContents, { skipEmptyLines: true, fromLine: 2, });
		let inserts: any = [];
		rows.forEach((row: any) => {
			let thiefId = row[0];
			for (let i = 1; i < columnToTable.length; i++) {
				let val = row[i];
				if (val === '') { continue; }
				let col = columnToTable[i];
				inserts.push(tryInsertRow(col, thiefId, val));
			}
		})
		console.log(`Recieved ${inserts.length} data items`)
		await Promise.all(inserts);
		console.log(`Returning ${JSON.stringify(newDataCnts)}`);
		resolve(newDataCnts);
	});
}

const router = express.Router();
router.post("/", upload.single('file'), async (req: express.Request, res: express.Response) => {
	try {
		return res.json(await processFile(req));
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});
export default router;
