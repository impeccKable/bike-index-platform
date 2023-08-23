import { db } from "./config";
import { logHistory } from "./routes/history";

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

const MAX_ROW = 24;

async function getTotal(table: string, condition = '', values: any[]): Promise<number> {
	const query = `SELECT COUNT(*) FROM ${table} ${condition}`;
	let result;
	try {
		result = await db.one(query, values);
	} catch (err) {
		console.log('Error getting total rows for user', err);
	}
	return +result.count;
}

async function fetchDataWithPage(query: string, values: any[], table: string, condition = '') {
	try {
		const data = await db.any(query, values);
		const total = await getTotal(table, condition, values);

		return {
			data: data,
			meta: {
				totalRows: total,
				totalPages: Math.ceil(total / MAX_ROW),
			}
		}
	} catch (err) {
		console.log("Error getting user data from database:", err);
	}
}


// Summary: Gets all users from the "bi_user" database and returns an object with the below column names.
// Returns: Array of user objects with the key format above.
export async function GetAllUsers(page: number) {
	const offset = (page - 1) * MAX_ROW;
	const query = "SELECT user_uid AS userid, CONCAT(first_name, ' ', last_name) as name, email, phone, role, title, org, approved, banned FROM bi_user LIMIT $1 OFFSET $2";
	try {
		return fetchDataWithPage(query, [MAX_ROW, offset], 'bi_user');
	}
	catch (exc) {
		console.log(`[ backend.src.userData.ts.GetAllUsers() ] Error Attempting To Query For All Users. Exception Message: ${exc}`);
	}
}

export async function GetUserByID(userID: string, page: number) {
	const offset = (page - 1) * MAX_ROW;
	const query = `SELECT user_uid AS userid, first_name, last_name, email, phone, role, title, org, approved, banned FROM bi_user WHERE user_uid = '${userID}' LIMIT $1 OFFSET $2`;
	try {
		return fetchDataWithPage(query, [MAX_ROW, offset], 'bi_user', `WHERE user_uid = '${userID}'`);
	}
	catch (exc) {
		console.log(`[ backend.src.userData.ts.GetUserByID() ] Error Attempting To Query For UserID '${userID}'. Exception Message: ${exc}`);
	}
}

export async function GetUserBySearchType(key: string, type: string, page: number) {
	try {
		const offset = (page - 1) * MAX_ROW;
		const baseQuery = "SELECT user_uid AS userid, CONCAT(first_name, ' ', last_name) as name, email, phone, role, title, org, approved, banned FROM bi_user";
		let condition = '';
		let values: any[] = [];
		console.log(`Key: ${key},  Type: ${type}`);

		if (type.toLowerCase() === "name") {
			condition = `WHERE first_name ILIKE $1 OR last_name ILIKE $1`;
		} else if (types[type]) {
			condition = `WHERE ${type} ILIKE $1`;
		}

		const query = `${baseQuery} ${condition} LIMIT $2 OFFSET $3`;
		values = [`%${key}%`, MAX_ROW, offset];

		return fetchDataWithPage(query, values, 'bi_user', condition);
	}
	catch (exc) {
		console.log(`[ backend.src.userData.ts.GetUserBySearchType() ] Error Attempting To Query For Users by Search Key '${key}' and Search Type '${type}'. Exception Message: ${exc}`);
	}
}

export async function PutUserInfo(userInfo: any, uid: string) {
	try {
		for (let key in userInfo) {
			if (key === "userid") {
				continue;
			}
			await db.any(`UPDATE bi_user SET ${key} = ($1) WHERE user_uid = ($2);`, [userInfo[key], userInfo.userid]);
			try {
				await logHistory({ user_uid: uid, changed_user_uid: userInfo.userid, data_type: `${key}`, data: `${userInfo[key]}` }, 'update');
			} catch (err) {
				console.log('Error while logging user history:', err);
				throw err;
			}
		}
	}
	catch (exc) {
		console.log(`[ backend.src.userData.ts.PutUserInfo() ] Error Attempting To Put User Info. Exception Message: ${exc}`);
	}
}