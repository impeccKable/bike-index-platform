import express from 'express';
import { db } from '../config';

export type UserInput = {
	user_uid: string;
	changed_thief_id?: number | null
	changed_user_uid?: string | null
	data_type: string;
	data: string;
}

export const logHistory = async (data: UserInput, action: string) => {
	try {
		await db.none(
			'INSERT INTO history (datetime, user_uid, action, changed_thief_id, changed_user_uid, data_type, data) ' +
			'VALUES ($1, $2, $3, $4, $5, $6, $7)',
			[new Date(), data.user_uid, action, data.changed_thief_id, data.changed_user_uid, data.data_type, data.data]);
	} catch (err) {
		console.error('Failed to log history:', err);
		throw err;
	}
}

const get = async (query: any) => {
	const MAX_ROW = 10;
	const page = query.page || 1;
	const offset = (page - 1) * MAX_ROW;
	const thiefId = query.thiefId;
	const userId = query.userId;


	let whereForId = '';
	const params: any[] = [MAX_ROW, offset]
	if (thiefId) {
		whereForId = `changed_thief_id = $3`;
		params.push(thiefId);
	} else if (userId) {
		whereForId = `changed_user_uid = $3`;
		params.push(userId);
	}

	const queryWithUserTable = `
			SELECT
				h.id,
				TO_CHAR(h.datetime, 'YYYY-MM-DD HH24:MI:SS') as datetime,
				u.first_name || ' ' || u.last_name as user_name,
				h.action,
				h.changed_thief_id,
				h.changed_user_uid,
				h.data_type,
				h.data
			FROM history h
			JOIN bi_user u ON h.user_uid = u.user_uid`;

	const queryWithNoUserTable = `
			SELECT
				history_id,
				TO_CHAR(datetime, 'YYYY-MM-DD HH24:MI:SS') as datetime,
				user_uid as user_name,
				action,
				changed_thief_id,
				changed_user_uid,
				data_type,
				data
			FROM history`;

	const whereClause = thiefId ? `WHERE ${whereForId}` : '';
	const orderByAndLimit = `ORDER BY datetime DESC LIMIT $1 OFFSET $2`;
	const completeQuery = `${queryWithNoUserTable} ${whereClause} ${orderByAndLimit}`;

	let countBase = 'SELECT COUNT(*) FROM history';
	const countParams = [];
	if (thiefId) {
		countBase += ' WHERE changed_thief_id = $1';
		countParams.push(thiefId);
	} else if (userId) {
		countBase += ' WHERE changed_user_uid = $1';
		countParams.push(userId);
	}

	const [rows, { count: total }] = await Promise.all([
		db.any(completeQuery, params),
		db.one(countBase, countParams)
	]);

	return {
		data: rows,
		meta: {
			totalRows: total,
			totalPages: Math.ceil(total / MAX_ROW),
		}
	}

}

const router = express.Router();
router.get('/', async (req: express.Request, res: express.Response) => {
	try {
		res.json(await get(req.query));
	} catch (err) {
		console.error('Failed to fetch history:', err);
		res.status(500).send('Failed to fetch history');
	}
});

export default router;