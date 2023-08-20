import express from 'express';
import { db } from '../config';

async function get() {
	let [
		thieves, users, names, emails, urls, addresses, phones, bikeSerials, phrases, notes
	] = await Promise.all([
		db.one(`SELECT count(*) from (
			SELECT DISTINCT thief_id FROM (
				SELECT thief_id FROM name
				UNION SELECT thief_id FROM email
				UNION SELECT thief_id FROM url
				UNION SELECT thief_id FROM addr
				UNION SELECT thief_id FROM phone
				UNION SELECT thief_id FROM bike_serial
				UNION SELECT thief_id FROM phrase
				UNION SELECT thief_id FROM note
			) AS t
		) AS t2`),
		db.one("SELECT count(*) FROM bi_user"),
		db.one("SELECT count(*) FROM name"),
		db.one("SELECT count(*) FROM email"),
		db.one("SELECT count(*) FROM url"),
		db.one("SELECT count(*) FROM addr"),
		db.one("SELECT count(*) FROM phone"),
		db.one("SELECT count(*) FROM bike_serial"),
		db.one("SELECT count(*) FROM phrase"),
		db.one("SELECT count(*) FROM note"),
	]);

	return {
		thieves:     parseInt(thieves.count),
		users:       parseInt(users.count),
		names:       parseInt(names.count),
		emails:      parseInt(emails.count),
		urls:        parseInt(urls.count),
		addresses:   parseInt(addresses.count),
		phones:      parseInt(phones.count),
		bikeSerials: parseInt(bikeSerials.count),
		phrases:     parseInt(phrases.count),
		notes:       parseInt(notes.count),
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
