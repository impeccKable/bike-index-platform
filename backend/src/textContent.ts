
import express from 'express';
import db from "./dbConfig";



const router = express.Router();

const GetByPageName = async (pageName: string) => {
    let query = `SELECT body FROM text_content WHERE page_name = '${pageName}';`;
    let response = await db.one(query);

    return response[0].body
}


router.get('/', async (req: express.Request, res: express.Response) => {
    let pageName = req.query.pageName;
    
    return res.json(await GetByPageName(pageName?.toString() ?? ""));
});

export default router;