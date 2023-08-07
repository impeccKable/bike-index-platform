
import express from 'express';
import db from "./dbConfig";



const router = express.Router();

const GetByPageName = async (pageName: string) => {
    let query = `SELECT contentid, page_name, label, body, ishidden FROM text_content WHERE page_name = '${pageName}';`;
    let response = await db.one(query);
    return response;
}

const UpdatePageContent = async (pageName: string, body: string) => {
    body = body.replace("'", "''");
    let query = `SELECT contentid FROM text_content WHERE page_name = '${pageName}'`;
    let entryExists = await db.any(query);

    if (entryExists.length === 0) {
        query = `INSERT INTO text_content (page_name, label, body, ishidden) VALUES ('${pageName}','','${body}', 'false')`;
    }
    else {
        query = `UPDATE text_content SET body = '${body}' WHERE page_name = '${pageName}';`;
    }

    let response = await db.any(query);
    console.log("Update Response: ", response);
};

async function UpdatePageContentModified(data: any) {
    let query = "UPDATE text_content SET ";
    let commaDelimited = false;
    
    Object.keys(data).forEach( (key, index) => {
        if (commaDelimited) {
            query += ', ';
        }
        if (key.toLowerCase() !== 'pagename') {
            query += `${key} = '${data[key]}'`;
            commaDelimited = true;
        }
    });

    query += ` WHERE page_name = '${data.pageName}';`;

    return await db.any(query);
}


router.get('/', async (req: express.Request, res: express.Response) => {
    let pageName = req.query.pageName;
    
    res.json(await GetByPageName(pageName?.toString() ?? ""));
});

router.put('/', async (req: express.Request, res: express.Response) => {
    console.log("put request", req.body);
    UpdatePageContentModified(req.body);
    //let response = UpdatePageContent(req.body.pageName, req.body.body);
    res.json("Test");
});

export default router;