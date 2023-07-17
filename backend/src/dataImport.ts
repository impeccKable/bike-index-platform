import express from "express";
import csv from "csv-parse";
import fs from "fs";

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
import db from './dbConfig';

let columnToTable = [ 'thief_id', 'name', 'email', 'url', 'addr', 'phone', 'bike_serial', 'phrase', 'note', ];

const processFile = (req: any) => {
	let data = fs.readFileSync(req.file.path, 'utf8');
	const parser = csv.parse(data);
	parser.on('readable', async function () {
		let row;
		while (row = parser.read()) {
			// skip header by matching a character
			if (row[0].match(/[a-z]/i)) { continue; }

			let thiefId = row[0];
			for (let i = 1; i < columnToTable.length; i++) {
				let col = columnToTable[i];
				let val = row[i];
				if (val === '') {
					continue;
				}
				try {
					await db.none(`INSERT INTO ${col} VALUES ($1, $2);`, [thiefId, val]);
				} catch (err: any) {
					// duplicate primary key constraint
					if (err.code === '23505') { continue; }
					else { throw err; }
				}
			}
		}
	});
}

const router = express.Router();
router.post("/", upload.single('file'), async (req: express.Request, res: express.Response) => {
	try {
		processFile(req);
		return res.json();
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});
export default router;
