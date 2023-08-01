import express from "express";
import db from "./dbConfig"
import { GetAllUsers, GetUserByID, GetUserBySearchType } from "./userData";

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

const GetBySearchType = async (searchkey: string, searchType: string) => {
    return await GetUserBySearchType(searchkey, searchType);
}

router.get("/", async (req: express.Request, res: express.Response) => {
    try 
    {
        let key = req.query.searchKey;
        let type = req.query.searchType;

        if (key !== undefined && type !== undefined && key !== "All" && !IsNullOrEmpty(key)) {
            let test = res.json(await GetBySearchType(key.toString(), type.toString()));

            return test;
        }
        else {
            return res.json(await Get());
        }

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