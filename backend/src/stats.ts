import express from "express";
import db from "./dbConfig";

async function get() {
	let [
		thieves, users, urls, phones, emails, addresses, names
	] = await Promise.all([
		db.one("SELECT last_value FROM next_thief_id"),
		db.one("SELECT count(*) FROM bi_user"),
		db.one("SELECT count(*) FROM url"),
		db.one("SELECT count(*) FROM phone"),
		db.one("SELECT count(*) FROM email"),
		db.one("SELECT count(*) FROM addr"),
		db.one("SELECT count(*) FROM name"),
	]);

	return {
		thieves:   parseInt(thieves.last_value),
		users:     parseInt(users.count),
		urls:      parseInt(urls.count),
		phones:    parseInt(phones.count),
		emails:    parseInt(emails.count),
		addresses: parseInt(addresses.count),
		names:     parseInt(names.count),
	};
}

const router = express.Router();
router.get("/", async (req: express.Request, res: express.Response) => {
	try {
		return res.json(await get());
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});
export default router;
