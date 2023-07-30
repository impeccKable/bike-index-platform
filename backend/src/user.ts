import express from "express";
import db from "./dbConfig"
import { GetAllUsers, GetUserByID } from "./userData";

const router = express.Router();

const IsNullOrEmpty = (Item: any) => {
    return Item === null || Item === undefined || Item === '';
}

const Get = async () => {
    return await GetAllUsers();
}

const GetByID = async (userID: string) => {

    if (!IsNullOrEmpty(userID)) {
        console.log("User ID: ", userID);
        return await GetUserByID(userID);
    }

    return {};
}

router.get("/", async (req: express.Request, res: express.Response) => {
    try 
    {
        return res.json(await Get());
    }
    catch (exc)
    {
        console.log(`[ backend.src.user.ts.get('/') Error Attempting To Get All Users. Message: ${exc} ]`)
    }
});

router.get("/:userId", async (req: express.Request, res: express.Response) => {
    try 
    {
        return res.json(await GetByID(req.params.userId?.toString() ?? ''));
    }
    catch (exc)
    {
        console.log(`[ backend.src.user.ts.get('/') Error Attempting To Get All Users. Message: ${exc} ]`)
    }
});

export default router;