
import express from 'express';
import db from "./dbConfig";



const router = express.Router();

const GetByPageName = async (pageName: string) => {
    let query = `SELECT contentid FROM text_content WHERE page_name = '${pageName}'`;
    let exists = await db.any(query);

    console.log("exists", exists.length);
    
    if (exists.length === 0 && !IsNullOrEmpty(pageName)) {
        console.log("insert reached");
        query = `INSERT INTO text_content (page_name, label, body, isHidden) VALUES ('${pageName}', '${pageName}', '', 'false');`;
        let result = await db.any(query);
        console.log("Insert Result", result);
    }
    
    query = `SELECT contentid, page_name, label, body, ishidden FROM text_content WHERE page_name = '${pageName}';`;
    let response = await db.any(query);

    console.log("Get Page Response: ", response);
    return response[0];
}

function IsNullOrEmpty(value: any) {
    return value === null || value === undefined || value === "";
}

async function UpdatePageContentModified(data: any) {
    let query = `SELECT contentid FROM text_content WHERE page_name = '${data["pageName"]}'`;
    let exists = await db.any(query);
    
    if (exists.length === 0 && IsNullOrEmpty(data["pageName"])) {
        query = `INSERT INTO text_content (page_name, label, body, isHidden) VALUES ('${data["pageName"]}', '${data["label"] ?? ''}', '${data["body"]??''}', '${data["isHidden"]??'false'}');`;
        let result = await db.any(query);
        console.log("Insert Result", result);
    }
    else {
        query = "UPDATE text_content SET ";
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
}


router.get('/', async (req: express.Request, res: express.Response) => {
    let pageName = req.query.pageName;
    res.json(await GetByPageName(pageName?.toString() ?? ""));
});

router.put('/', async (req: express.Request, res: express.Response) => {
    console.log("put request", req.body);
    UpdatePageContentModified(req.body);
    res.json("Test");
});

export default router;