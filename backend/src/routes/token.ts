import express from 'express';
import { auth } from '../../app';

export async function validToken(req: express.Request): Promise<string> {
	let token = '';

	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		token = req.headers.authorization.split(' ')[1];
		if (token[0] === `"`) {
			token = token.slice(1, -1);
		}
	}
	if (!token) {
		throw new Error("No token in header");
	}
	return auth.verifyIdToken(token)
		.then((decodedToken: any) => decodedToken.uid)
		.catch((err: any) => { throw new Error(err.message) });
}

const router = express.Router();
router.post("/", async (req: express.Request, res: express.Response) => {
	try {
		return res.json(await validToken(req));
	} catch (err:any) {
		console.error(err);
		if(err.message === "No token in header") {
			return res.status(500).send("No token in header");
		}
		return res.status(401).send("Failed to authorize");
	}
});
export default router;
