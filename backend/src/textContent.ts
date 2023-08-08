
import express from 'express';
import db from "./dbConfig";

const router = express.Router();

/// Summary: makes a query to the text_content db table for a row with a matching pagename
///          as the argument parameter. if a page a found the row is returned to the calling
///          routine else if not row is found a new row is inserted then returned to the calling
///          routine.
/// Params:
///     - "pageName": page name that text content belongs to.
/// Returns: array of {contentid:"", page_name:"", label:"", body:"", isHidden:""}
const GetByPageName = async (pageName: string) => {
    try 
    {
        let query = `SELECT contentid FROM text_content WHERE page_name = '${pageName}'`;
        let exists = await db.any(query);

        if (exists.length === 0 && !IsNullOrEmpty(pageName)) {
            query = `INSERT INTO text_content (page_name, label, body, isHidden) VALUES ('${pageName}', '${pageName}', '', 'false');`;
            let result = await db.any(query);
        }
        
        query = `SELECT contentid, page_name, label, body, ishidden FROM text_content WHERE page_name = '${pageName}';`;
        let response = await db.any(query);
        return response[0];
    }
    catch (exc) {
        console.log(`[ backend.src.textContent.ts.GetByPageName() ] Error Attempting To Query for Text Content: Error Message: ${exc}`);
        return {body:"No Data Found"};
    }
}

function IsNullOrEmpty(value: any) {
    return value === null || value === undefined || value === "";
}

/// Summary: Updates a text content row in the database if it exists.
///          Rows updated are those found in the object at run time.
///          if the page does not exist in the table 
/// Params:
///     - "pageName": page name that text content belongs to.
/// Returns: array of {contentid:"", page_name:"", label:"", body:"", isHidden:""}
async function UpdatePageContent(data: any) {
    try 
    {
        let query = `SELECT contentid FROM text_content WHERE page_name = '${data["pageName"]}'`;
        let exists = await db.any(query);
        
        if (exists.length !== 0 && !IsNullOrEmpty(data["pageName"])) {
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
        else {
            console.log(`[ backend.src.textContent.ts.GetByPageName() ] Page '${data.pageName}' Not Found. Update Not Executed.`);
        }
    }
    catch (exc) {
        console.log(`[ backend.src.textContent.ts.UpdatePageContent() ] Error Attempting To Update Text Content: Exception Message: ${exc}`);
        return {body:"No Data Found"};
    }
}

router.get('/', async (req: express.Request, res: express.Response) => {
    try 
    {
        let pageName = req.query.pageName;
        res.json(await GetByPageName(pageName?.toString() ?? ""));
    }
    catch (exc)
    {
        console.log(`[ backend.src.textContent.ts.get('/') ] Error Invoking GetByPageName Method. Exception Message: ${exc}`);
    }
});

router.put('/', async (req: express.Request, res: express.Response) => {
    try 
    {
        UpdatePageContent(req.body);
        res.json("Test");
    }
    catch (exc)
    {
        console.log(`[ backend.src.textContent.ts.put('/') ] Error Invoking UpdatePageContent Method. Exception Message: ${exc}`);
    }
});

export default router;