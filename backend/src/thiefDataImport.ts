import express from "express";
import { parse } from "csv/sync";
import fs from "fs";

export const csvStandardHeader =
	[ 'Thief Id', 'Name', 'Email', 'Url', 'Address', 'Phone', 'Bike Serial', 'Phrase', 'Notes' ]

const multer = require("multer");
const upload = multer({
	dest: "userFiles/uploads/",
	filename: (req: any, file: any, cb: any) => {
		console.log(req);
		cb(null, `import_${Date.now()}.csv`);
	}
});
import db from './dbConfig';

let columnToTable = [ 'thief_id', 'name', 'email', 'url', 'addr', 'phone', 'bike_serial', 'phrase', 'note', ];

const processFile = (req: any) => {
	let newDataCnts: any = { 'rowCnt': 0, 'dataCnt': 0, 'thief': 0, 'name': 0, 'email': 0, 'url': 0, 'addr': 0, 'phone': 0, 'bike_serial': 0, 'phrase': 0, 'note': 0, };
	let maxThiefId = -1;

	const tryInsertRow = async (table: string, thief_id: string, val: string) => {
		try {
			await db.none(`INSERT INTO ${table} VALUES ($1, $2);`, [thief_id, val]);
			newDataCnts[table]++;
		} catch (err: any) {
			// duplicate primary key constraint
			if (err.code === '23505') { return; }
			else { throw err; }
		}
	};

	return new Promise(async (resolve, reject) => {
		const fileContents = fs.readFileSync(req.file.path, 'utf8');
		const rows = parse(fileContents, { skipEmptyLines: true, fromLine: 2, });
		let inserts: any = [];
		for (let row of rows) {
			newDataCnts['rowCnt']++;
			let thiefId = row[0];
			if (thiefId === '') { continue; }
			if (parseInt(thiefId) > maxThiefId) {
				maxThiefId = parseInt(thiefId);
			}
			for (let i = 1; i < columnToTable.length; i++) {
				let val = row[i];
				if (val === '') { continue; }
				newDataCnts['dataCnt']++;
				let col = columnToTable[i];
				inserts.push(tryInsertRow(col, thiefId, val));
			}
		}
		console.log(`Recieved ${inserts.length} thief data items`)

		// Update next_thief_id
		let lastThiefId = (await db.one(`SELECT last_value FROM next_thief_id;`)).last_value;
		if (maxThiefId > lastThiefId) {
			console.log(`Updating next_thief_id to ${maxThiefId}`);
			await db.one(`SELECT setval('next_thief_id', ${maxThiefId});`);
		}

		await Promise.all(inserts);
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
