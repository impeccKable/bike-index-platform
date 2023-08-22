import express from 'express';
import { db } from '../config';
import { stringify } from 'csv/sync';
import fs from 'fs';
import { fieldToTable, fields, getThiefData } from '../thiefData';
import { csvStandardHeader } from './thiefDataImport';

async function get(res: express.Response) {
	let query = "SELECT thief_id FROM "
		+ fields.map((field, idx) =>
			`(SELECT thief_id FROM ${fieldToTable[field]})`
			+ (idx == 0 ? " AS thief_ids" : "")
		).join(" UNION ") // union removes duplicates
		+ " ORDER BY thief_id ASC";
	let allThiefIds: number[] = (await db.any(query)).map((row: any) => row.thief_id);
	let thiefInfos = await getThiefData(allThiefIds);

	let rows = [csvStandardHeader];
	for (let thiefInfo of thiefInfos) {
		let maxCnt = Math.max(...fields.map((field) => thiefInfo[field].length));
		for (let i = 0; i < maxCnt; i++) {
			let row = [thiefInfo.thiefId.toString()];
			for (let field of fields) {
				row.push(thiefInfo[field][i] || '');
			}
			rows.push(row);
		}
	}
	let filepath = `userFiles/downloads/thiefData_${Date.now()}.csv`;
	fs.mkdirSync('userFiles/downloads', { recursive: true });
	fs.writeFileSync(filepath, stringify(rows));
	res.download(filepath);
};

const router = express.Router();
router.get('/', async (req: express.Request, res: express.Response) => {
	try {
		await get(res);
		res.status(200)
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});
export default router;
