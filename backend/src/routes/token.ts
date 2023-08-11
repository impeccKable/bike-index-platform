import express from 'express';
import { auth } from '../../app';

export const validToken = (req: express.Request):boolean => {
	let token = '';
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		token = req.headers.authorization.split(' ')[1];
		if (token[0] === `"`) {
			token = token.slice(1, -1);
		}
	}
	if (!token) {
		return false;
	}
	try {
		auth.verifyIdToken(token);
		return true;
	} catch (err) {
		return false;
	}
}

const router = express.Router();
router.post("/", async (req: express.Request, res: express.Response) => {
	try {
		return res.json();
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});
export default router;
