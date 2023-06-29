import express from "express";
import db from "./dbConfig";

const post = async (req: any) =>{
	return await db.one(`
		SELECT
			role,
				approved,
				banned
			FROM bi_user
			WHERE user_uid = $1
		`,[
			req.body.uid,
		]);
}

const router = express.Router();
router.post("/", async (req: express.Request, res: express.Response) => {
	try {
		return res.json(await post(req));
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

export default router;
