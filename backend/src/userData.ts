import {db} from "./config";

const types: any = {
    userid: true,
    name: true,  
    email: true,
    phone: true,
    role: true,
    title: true,
    org: true,
    approved: true,
    banned: true
}


// Summary: Gets all users from the "bi_user" database and returns an object with the below column names.
// Returns: Array of user objects with the key format above.
export async function GetAllUsers() {
    try {
        return await db.any("SELECT user_uid AS userid, CONCAT(first_name, ' ', last_name) as name, email, phone, role, title, org, approved, banned FROM bi_user;");
    }
    catch (exc) {
        console.log(`[ backend.src.userData.ts.GetAllUsers() ] Error Attempting To Query For All Users. Exception Message: ${exc}`);
    }
}

export async function GetUserByID(userID: string) {
    try {
        return await db.any("SELECT user_uid AS userid, CONCAT(first_name, ' ', last_name) as name, email, phone, role, title, org, approved, banned FROM bi_user WHERE user_uid = ($1);",[userID]);
    }
    catch (exc) {
        console.log(`[ backend.src.userData.ts.GetUserByID() ] Error Attempting To Query For UserID '${userID}'. Exception Message: ${exc}`);
    }
}

export async function GetUserBySearchType (key: string, type: string) {
    try {
        console.log(`Key: ${key},  Type: ${type}`);
        let baseQuery = "SELECT user_uid AS userid, CONCAT(first_name, ' ', last_name) as name, email, phone, role, title, org, approved, banned FROM bi_user";

        if (type.toLowerCase() === "name") {
            return await db.any(`${baseQuery} WHERE first_name ILIKE $1 OR last_name ILIKE $2;`, [`%${key}%`, `%${key}%`]);
        }

        if (types[type]) {
            return await db.any(`${baseQuery} WHERE ${type} ILIKE $1;`, [`%${key}%`]);
        }

        return {};
    }
    catch (exc) {
        console.log(`[ backend.src.userData.ts.GetUserBySearchType() ] Error Attempting To Query For Users by Search Key '${key}' and Search Type '${type}'. Exception Message: ${exc}`);
    }
}