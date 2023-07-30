import express from "express";
import db from "./dbConfig"
import { GetAllUsers } from "./userData";

const router = express.Router();

const get = async () => {
    return await GetAllUsers();
}

router.get("/", async (req: express.Request, res: express.Response) => {
    try 
    {
        return res.json(await get());
    }
    catch (exc)
    {
        console.log(`[ backend.src.user.ts.get('/') Error Attempting To Get All Users. Message: ${exc} ]`)
    }
});

export default router;