import express from 'express';
import { parse } from 'csv/sync';
import fs from 'fs';
import { db } from '../config';
import { insertThiefData } from '../thiefData';

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

let columnToTable = [ 'thief_id', 'name', 'email', 'url', 'addr', 'phone', 'bike_serial', 'phrase', 'note', ];

function processFile(req: any) {
	return new Promise(async (resolve, reject) => {
		let newDataCnts: any = { 'rowCnt': 0, 'dataCnt': 0, 'thiefCnt': 0, 'name': 0, 'email': 0, 'url': 0, 'addr': 0, 'phone': 0, 'bike_serial': 0, 'phrase': 0, 'note': 0, };
		let thiefIds = new Set();
		let maxThiefId = -1;

		const fileContents = fs.readFileSync(req.file.path, 'utf8');
		const rows = parse(fileContents, { skipEmptyLines: true, fromLine: 2, });
		let inserts: any = [];
		for (let row of rows) {
			newDataCnts['rowCnt']++;
			let thiefId = row[0];
			if (thiefId === '') { continue; }
			thiefId = parseInt(thiefId);
			if (!thiefIds.has(thiefId)) {
				thiefIds.add(thiefId);
				newDataCnts['thiefCnt']++;
			}
			if (thiefId > maxThiefId) {
				maxThiefId = thiefId;
			}
			for (let i = 1; i < columnToTable.length; i++) {
				let val = row[i];
				if (val === '') { continue; }
				newDataCnts['dataCnt']++;
				let col = columnToTable[i];
				inserts.push([insertThiefData(col, thiefId, val), col]);
			}
		}
		console.log(`Received ${inserts.length} thief data items`) // I swear to god, I now hate e and i when they are next to each other

		// Update next_thief_id
		let lastThiefId = (await db.one(`SELECT last_value FROM next_thief_id;`)).last_value;
		if (maxThiefId > lastThiefId) {
			console.log(`Updating next_thief_id to ${maxThiefId}`);
			await db.one(`SELECT setval('next_thief_id', ${maxThiefId});`);
		}

		for (let i = 0; i < inserts.length; i++) {
			let [promise, col] = inserts[i];
			if (await promise) {
				newDataCnts[col]++;
			}
		}

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
