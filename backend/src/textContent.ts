
import express from 'express';
import db from "./dbConfig";



const router = express.Router();

const GetByPageName = async (pageName: string) => {
    let query = `SELECT body FROM text_content WHERE page_name = '${pageName}';`;
    let response = await db.one(query);
    return response.body;
}

const UpdatePageContent = async (pageName: string, body: string) => {
    body = body.replace("'", "''");
    let query = `SELECT contentid FROM text_content WHERE page_name = '${pageName}'`;
    let entryExists = await db.any(query);

    if (entryExists.length === 0) {
        query = `INSERT INTO text_content (page_name, label, body) VALUES ('${pageName}','','${body}')`;
    }
    else {
        query = `UPDATE text_content SET body = '${body}' WHERE page_name = '${pageName}';`;
    }

    let response = await db.any(query);
    console.log("Update Response: ", response);
};


router.get('/', async (req: express.Request, res: express.Response) => {
    let pageName = req.query.pageName;
    
    res.json(await GetByPageName(pageName?.toString() ?? ""));
});

router.put('/', async (req: express.Request, res: express.Response) => {
    console.log("put request", req.body);
    let response = UpdatePageContent(req.body.pageName, req.body.body);
    res.json("Test");
});

export default router;