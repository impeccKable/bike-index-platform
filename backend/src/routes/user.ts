import express from "express";
import { GetAllUsers, GetUserByID, GetUserBySearchType, PutUserInfo } from "../userData";
import multer from 'multer';

const upload = multer();

const router = express.Router();

// example Query: http://localhost:3000/api/user?userId=2oiwJmvUawY0RcdzQx5iE1ks7kC3
router.get("/", async (req: express.Request, res: express.Response) => {
	try {
		let key = req.query.searchKey;
		let type = req.query.searchType;
		let userId = req.query.userId;
		const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;

		if (userId) {
			console.log("user id route");
			return res.json(await GetUserByID(userId.toString(), page));
		}
		else if (!type || !key || key === "All") {
			console.log("All user route");
			return res.json(await GetAllUsers(page));
		}
		return res.json(await GetUserBySearchType(key.toString(), type.toString(), page));
	} catch (exc) {
		console.log(`[ backend.src.user.ts.get('/') Error Attempting To Get All Users. Message: ${exc} ]`)
	}
});

router.put("/", async (req: express.Request, res: express.Response) => {
	try {
		return res.json(await PutUserInfo(req.body));
	} catch (exc) {
		console.log(`[ backend.src.user.ts.put('/') Error Attempting To Put UserInfo. Message: ${exc} ]`)
	}
});
//example query: http://localhost:3000/api/user/userId=2oiwJmvUawY0RcdzQx5iE1ks7kC3
//router.get("/:userId", async (req: express.Request, res: express.Response) => {
//	try {
//		let userID = req.params.userId?.toString()?.replace("userId=", '') ?? '';
//		console.log("userID: ", userID);
//		if (!userID) {
//			return {};
//		}
//		return res.json(await GetUserByID(userID));
//	} catch (exc) {
//		console.log(`[ backend.src.user.ts.get('/:userId') Error Attempting To Get All Users. Message: ${exc} ]`)
//	}
//});

export default router;