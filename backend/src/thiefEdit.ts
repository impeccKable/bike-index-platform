import express from 'express';
import db from './dbConfig';
import { fieldToTable, fields, thiefInfoByIds } from './thiefInfo';
import { uploadImage, deleteImage, getImage, ImageUploadError, ImageDeletionError, ImageGetError} from './imageOperation';
import multer from 'multer';

const upload = multer();

async function get(query: any) {
	return thiefInfoByIds([parseInt(query.thiefId)]);
};

async function MergeThieves(body: any) {
	console.log(`Merging Thief: ${body.thiefIdMap[0]} into Thief: ${body.thiefIdMap[1]}`);
	Object.entries(fieldToTable).map(async (table)  => {
		let i = 0;
		//1.  From the current table, query for all rows with the old thief id
		let tableEntries = await db.any(`SELECT thief_id, ${table[1]} FROM ${table[1]} WHERE thief_id = $1`, [`${body.thiefIdMap[0]}`]);
		
		//2.  iterate rows returned if greater than 0 and for each one first check if
		//	  the row already exists for the new id.
		tableEntries.map(async (row:any)=>{
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

async function put(body: any) {
	let thiefId = body.thiefId;
	if (thiefId == 'new') {
		// (new thief, get next thief_id)
		thiefId = (await db.one("SELECT nextval('next_thief_id')"))['nextval'];
	}
	if (thiefId === 'merge') {
		let newThiefId = await MergeThieves(body);		
		body.thiefId, thiefId = newThiefId;
	}
	thiefId = parseInt(thiefId);
	for (let field of fields) {
		if (!body[field] || field === 'thiefIdMap') {
			continue;
		}
		for (let [oldVal, newVal] of body[field]) {
			let table = fieldToTable[field];
			if (newVal === '') {
				await db.none(
					`DELETE FROM ${table} WHERE thief_id = $1 AND ${table} = $2`,
					[thiefId, oldVal]
				);
			} else if (oldVal === '') {
				await db.none(
					`INSERT INTO ${table} (thief_id, ${table}) VALUES ($1, $2)`,
					[thiefId, newVal]
				);
			} else {
				await db.none(
					`UPDATE ${table} SET ${table} = $1 WHERE thief_id = $2 AND ${table} = $3`,
					[newVal, thiefId, oldVal]
				);
			}
		}
	}
	return thiefId;
};

const router = express.Router();
router.get('/', async (req: express.Request, res: express.Response) => {
	try {
		res.json({
			thiefInfo: await get(req.query),
			imageUrls: await getImage(req.query.thiefId as string),
		});
	} catch (err) {
		if (err instanceof ImageGetError) {
			console.log('ImageGetError', err);
			res.status(400).send("Error getting image");
		} else {
			console.error(err);
			res.status(500);
		}
	}
});

router.get('/images', async (req: express.Request, res: express.Response) => {
	try {
		res.json(await getImage(req.query.thiefId as string));
	} catch (err) {
		if (err instanceof ImageGetError) {
			console.error(err);
			res.status(400).send("Error getting image");
		}
		console.error(err);
		res.status(500);
	}

})

router.put('/', upload.array('newImages'), async (req: express.Request, res: express.Response) => {
	try {
		const thiefId = await put(JSON.parse(req.body.body));

		const promises = [];
		if (req.files && req.files.length !== 0) {
			promises.push(uploadImage(req.files as Express.Multer.File[], thiefId));
		}
		if (req.body.deletedImages) {
			promises.push(deleteImage(JSON.parse(req.body.deletedImages), thiefId));
		}
		await Promise.all(promises);

		res.status(200).json({ thiefId });
	} catch (err) {
		if (err instanceof ImageUploadError) {
			console.error(err);
			res.status(422).send("Error uploading file");
		} else if (err instanceof ImageDeletionError) {
			console.error(err);
			res.status(422).send("Error deleting file");
		} else {
			console.error(err);
			res.status(500);
		}
	}
});
export default router;
