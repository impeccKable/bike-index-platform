import db from "./dbConfig";


// Summary: Gets all users from the "bi_user" database and returns an object with the below column names.
// Returns: Array of user objects { userid: "", email: "", first: "", last: "", title: "", org: "", phone: "", role: "", approved: "", banned: "" }
export async function GetAllUsers() {
	let query = "SELECT user_uid AS userid, email, CONCAT(first_name, ' ', last_name) as name, title, org, phone, role, approved, banned FROM bi_user;"
	return await db.any(query);
}

export async function GetUserByID(userID: string) {
	let query = `SELECT user_uid AS userid, email, CONCAT(first_name, ' ', last_name) as name, title, org, phone, role, approved, banned FROM bi_user WHERE user_uid = '${userID}';`;
	return await db.any(query);
}

function GetPredicate(key: string, currentType: string) {
	if (currentType === "name") {
		return `WHERE first_name LIKE '%${key}%' OR last_name LIKE '%${key}%'`;
	} else {
		return `WHERE ${currentType} LIKE '%${key}%'`;
	}
}

export async function GetUserBySearchType(key: string, type: string) {
	let query = `SELECT user_uid AS userid, email, CONCAT(first_name, ' ', last_name) as name, title, org, phone, role, approved, banned FROM bi_user ${GetPredicate(key, type)};`;
	return await db.any(query);
}