import db from "../src/dbConfig";

const StatsModel = {
	getAll: async () => {
		let stats = {
			users:     await db.many("SELECT count(*) FROM biuser"),
			urls:      await db.many("SELECT count(*) FROM url"),
			phones:    await db.many("SELECT count(*) FROM phone"),
			emails:    await db.many("SELECT count(*) FROM email"),
			addresses: await db.many("SELECT count(*) FROM addr"),
			names:     await db.many("SELECT count(*) FROM name"),
		};
		stats = {
			users:     parseInt(stats.users[0].count),
			urls:      parseInt(stats.urls[0].count),
			phones:    parseInt(stats.phones[0].count),
			emails:    parseInt(stats.emails[0].count),
			addresses: parseInt(stats.addresses[0].count),
			names:     parseInt(stats.names[0].count),
		};
		return stats;
	},
};

export default StatsModel;
