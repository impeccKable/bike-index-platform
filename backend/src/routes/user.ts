import express from 'express';
import { getAllUsers, getUserByID, getUserBySearchType } from '../userData';

const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
	try {
		let key = req.query.searchKey;
		let type = req.query.searchType;
		if (!type || !key || key === "All") {
			return res.json(await getAllUsers());
		}
		return res.json(await getUserBySearchType(key.toString(), type.toString()));
	} catch (exc) {
		console.log(`[ backend.src.user.ts.get('/') Error Attempting To Get All Users. Message: ${exc} ]`)
	}
});

router.get("/:userId", async (req: express.Request, res: express.Response) => {
	try {
		let userID = req.params.userId?.toString() ?? '';
		if (!userID) {
			return {};
		}
		return res.json(await getUserByID(userID));
	} catch (exc) {
		console.log(`[ backend.src.user.ts.get('/') Error Attempting To Get All Users. Message: ${exc} ]`)
	}
});

export default router;