import express from "express";
import db from "./dbConfig";

const get = async () => {
	let stats = {
		thieves:   await db.one("SELECT last_value FROM next_thief_id"),
		users:     await db.one("SELECT count(*) FROM biuser"),
		urls:      await db.one("SELECT count(*) FROM url"),
		phones:    await db.one("SELECT count(*) FROM phone"),
		emails:    await db.one("SELECT count(*) FROM email"),
		addresses: await db.one("SELECT count(*) FROM addr"),
		names:     await db.one("SELECT count(*) FROM name"),
	};
	stats = {
		thieves:   parseInt(stats.thieves.last_value),
		users:     parseInt(stats.users.count),
		urls:      parseInt(stats.urls.count),
		phones:    parseInt(stats.phones.count),
		emails:    parseInt(stats.emails.count),
		addresses: parseInt(stats.addresses.count),
		names:     parseInt(stats.names.count),
	};
	return stats;
}

const router = express.Router();
router.get("/", async (req: express.Request, res: express.Response) => {
	try {
		return res.json(await get());
	} catch (err) {
		console.error(err);
		res.status(500).send("Error getting stats from db");
	}
});
export default router;
