import db from "./dbConfig";

/*
    Summary: Gets all users from the "bi_user" database and returns an object
             with the below column names.
    {
        userid: ""
        email: ""
        first: ""
        last: ""
        title: ""
        org: ""
        phone: ""
        role: ""
        approved: ""
        banned: ""
    }
*/
export const GetAllUsers = async () => {
    let query = "SELECT user_uid AS userid, email, first_name AS first, last_name AS last, title, org, phone, role, approved, banned FROM bi_user;"
    let queryResults = await db.any(query);
    return queryResults;
}