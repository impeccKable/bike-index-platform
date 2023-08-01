import db from "./dbConfig";


// Summary: Gets all users from the "bi_user" database and returns an object with the below column names.
// Returns: Array of user objects { userid: "", email: "", first: "", last: "", title: "", org: "", phone: "", role: "", approved: "", banned: "" }
export const GetAllUsers = async () => {
    let query = "SELECT user_uid AS userid, email, CONCAT(first_name, ' ', last_name) as name, title, org, phone, role, approved, banned FROM bi_user;"
    let queryResults = await db.any(query);
    
    return queryResults;
}

export const GetUserByID = async (userID: string) => {
    let query = `SELECT user_uid AS userid, email, CONCAT(first_name, ' ', last_name) as name, title, org, phone, role, approved, banned FROM bi_user WHERE user_uid = '${userID}';`;
    let queryResults = await db.any(query);
    return queryResults;
}

const GetPredicate = (key: string, currentType: string) => {
    let predicate = '';

    if (currentType === "name") {
        predicate = `WHERE first_name LIKE '%${key}%' OR last_name LIKE '%${key}%'`;
    }
    else {
        predicate = `WHERE ${currentType} LIKE '%${key}%'`;
    }

    return  predicate;
}

export const GetUserBySearchType = async (key: string, type: string) => {
    let query = `SELECT user_uid AS userid, email, CONCAT(first_name, ' ', last_name) as name, title, org, phone, role, approved, banned FROM bi_user ${GetPredicate(key, type)};`;
    return await db.any(query);
}