
import express from 'express';
import db from "./dbConfig";

const router = express.Router();

/// Summary: makes a query to the text_content db table for a row with a matching pagename
///       as the argument parameter. if a page a found the row is returned to the calling
///       routine else if not row is found a new row is inserted then returned to the calling
///       routine.
/// Params:
///	 - "pageName": page name that text content belongs to.
/// Returns: array of {contentid:"", page_name:"", label:"", body:"", isHidden:""}
async function GetByPageName(pageName: string) {
	try {
		let exists = await db.any("SELECT contentid FROM text_content WHERE page_name = ($1)", [pageName]);

		if (exists.length === 0 && !IsNullOrEmpty(pageName)) {
			let result = await db.any("INSERT INTO text_content (page_name, label, body, isHidden) VALUES ($1, $2, $3, $4);",[pageName, pageName, '', false]);
		}

		let response = await db.any("SELECT contentid, page_name, label, body, ishidden FROM text_content WHERE page_name = ($1);", [pageName]);
		return response[0];
	} catch (exc) {
		console.log(`[ backend.src.textContent.ts.GetByPageName() ] Error Attempting To Query for ${pageName} Text Content: Error Message: ${exc}`);
		return {body:"No Data Found"};
	}
}

function IsNullOrEmpty(value: any) {
	return value === null || value === undefined || value === "";
}

/// Summary: Updates a text content row in the database if it exists.
///       Rows updated are those found in the object at run time.
///       if the page does not exist in the table
/// Params:
///	 - "data": Object of table attributes to update
/// Returns: No Return value.
async function UpdatePageContent(data: any) {
	try {
		//let query = `SELECT contentid FROM text_content WHERE page_name = ($1)`;
		let exists = await db.any("SELECT contentid FROM text_content WHERE page_name = ($1)", [data["pageName"]]);
		if (exists.length === 0 || IsNullOrEmpty(data["pageName"])) {
			console.log(`[ backend.src.textContent.ts.GetByPageName() ] Page '${data.pageName}' Not Found in text_content table. Update Not Executed.`);
			return {body:"No Data Found"};
		}
        let sets: string[] = [];
        Object.keys(data).forEach( (key) => {
            if (key === 'pageName') return;
            sets.push(`${key} = $(${key})`);
        });
        return await db.any(`
            UPDATE text_content
            SET ${sets.join(', ')}
            WHERE page_name = $(pageName);
        `, data);

    } catch (exc) {
		console.log(`[ backend.src.textContent.ts.UpdatePageContent() ] Error Attempting To Update Text Content: Exception Message: ${exc}`);
		return {body:"No Data Found"};
	}
}

router.get('/', async (req: express.Request, res: express.Response) => {
	try {
		let response = await GetByPageName(req.query.pageName?.toString() ?? "");
		if (response.body !== "No Data Found") {
			res.json(response);
		} else {
			res.status(500).json(response);
		}
	} catch (exc) {
		console.log(`[ backend.src.textContent.ts.get('/') ] Error Invoking GetByPageName Method. Exception Message: ${exc}`);
	}
});

router.put('/', async (req: express.Request, res: express.Response) => {
	try {
		const response = await UpdatePageContent(req.body);
		// error status not working...
		if (response.body !== "No Data Found") {
			res.json("Success");
		}
		else {
			return res.status(500);
		}
	} catch (exc) {
		console.log(`[ backend.src.textContent.ts.put('/') ] Error Invoking UpdatePageContent Method. Exception Message: ${exc}`);
	}
});

export default router;