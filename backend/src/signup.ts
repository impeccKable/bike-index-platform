import express from 'express';
import db from './dbConfig';

async function post(req: any) {
	req.body.role = 'readWrite';
	req.body.approved = false;
	req.body.banned = false;
	await db.any(`
		INSERT INTO bi_user (
			user_uid,
			email,
			first_name,
			last_name,
			title,
			org,
			phone,
			role,
			approved,
			banned
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`, [
		req.body.uid,
		req.body.email,
		req.body.first,
		req.body.last,
		req.body.title,
		req.body.org,
		req.body.phone,
		req.body.role,
		req.body.approved,
		req.body.banned,
	]);
};

const router = express.Router();
router.post('/', async (req: express.Request, res: express.Response) => {
	try {
		console.log(req.body);
		return res.json(await post(req));
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});
export default router;
