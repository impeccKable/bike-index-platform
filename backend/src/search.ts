import express from "express";
import db from "./dbConfig";
import { fieldToTable, thiefInfoByIds } from "./thiefInfo";
import { auth } from "../app";

// Get matching thief_ids
const get = async (query: any) => {
	let searchType: string = query.searchType;
	let search: string = query.search;
	let thiefIds: Array<number> = [];
	if (!searchType || !search) {
		return thiefIds; // TODO: return most recent thieves
	}
	let table = fieldToTable[searchType];
	if (table === "addr") {
		thiefIds = await db.any(`
			SELECT thief_id
			FROM addr
			WHERE line1 ILIKE $1
				OR line2 ILIKE $1
				OR city  ILIKE $1
				OR state ILIKE $1
				OR zip   ILIKE $1
		`, [`%${search}%`]);

	} else if (table) {
		thiefIds = await db.any(`
			SELECT thief_id
			FROM ${table}
			WHERE ${table} ILIKE $1
		`, [`%${search}%`]);

	} else {
		throw new Error(`Unknown search type: ${query.searchType}`);
	}
	thiefIds = thiefIds.map((obj: any) => obj.thief_id);
	return await thiefInfoByIds(thiefIds);
}

const router = express.Router();
router.get("/", async (req: express.Request, res: express.Response) => {
	try {
		let token = '';

		if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			token = req.headers.authorization.split(' ')[1];
			if(token[0]===`"`){
				token = token.slice(1,-1);
			}
		}

		if(!token){
			res.status(401).send("No valid token provided");
			return;
		}

		console.log(token);

		auth.verifyIdToken(token)
			.then(async (decodedToken: any) => {
				console.log(decodedToken);
		});

		const result = await get(req.query);
		console.log(result);

		return res.json(result);
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});
export default router;
