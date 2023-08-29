import express from "express";
import { db } from "../config";
import { fieldToTable, getThiefData } from "../thiefData";
import { validToken } from "./token";

const MAX_ROW = 24;

const get = async (query: any) => {
	const { searchType, searchText, page = 1 } = query;
	const scores: Map<number, number> = new Map();
	const offset = (page - 1) * MAX_ROW;
	const isSearchTextValid = searchText && searchText.trim() !== "";

	if (!searchType) {
		return [];
	}


	const queryForTable = (table: string) => {
		if (isSearchTextValid) {
			return `
				WITH IDMatches AS (
					SELECT thief_id, 0 as distance
					FROM ${table} 
					WHERE CAST(thief_id AS TEXT) = $1
					GROUP BY thief_id
				),
				ExactMatches AS (
					SELECT thief_id, 0 as distance
					FROM ${table} 
					WHERE ${table} ILIKE $2
					GROUP BY thief_id
				),
				SimilarMatches AS (
						SELECT thief_id, MIN(levenshtein(${table}, $1)) as distance
						FROM ${table}
						WHERE levenshtein(${table}, $1) <= 2
						AND thief_id NOT IN (SELECT thief_id FROM ExactMatches)
						AND thief_id NOT IN (SELECT thief_id FROM IDMatches)
						GROUP BY thief_id
				)
				SELECT * FROM IDMatches
				UNION ALL
				SELECT * FROM ExactMatches 
				UNION ALL
				SELECT * FROM SimilarMatches 
				ORDER BY distance ASC, thief_id DESC;`;
		} else {
			return `
				SELECT thief_id
				FROM ${table}
				GROUP BY thief_id`;
		}
	};

	const getScoresForThiefId = async (table: string) => {
    try {
        const params = [searchText];
        const idMatchQuery = `
            SELECT DISTINCT thief_id
            FROM ${table}
						${isSearchTextValid ? `WHERE CAST(thief_id AS TEXT) = $1` : ''}`;

				const result = await db.any(idMatchQuery, params);

        result.forEach((item: any) => {
                scores.set(item.thief_id, 0);
        });

    } catch (err) {
        console.error('Error querying for thief_id', err);
    }
};

	const getScores = async (table: string) => {
		try {
			const params = isSearchTextValid ? [searchText, `%${searchText}%`] : [];
			const result = await db.any(queryForTable(table), params);
			result.forEach((item: any) => {
				scores.set(item.thief_id, (scores.get(item.thief_id) || 0) + item.distance);
			});
		} catch (err) {
			console.error(`Error querying table ${table}`, err);
		};
	}

	if (searchType === "all") {
		await Promise.all(Object.values(fieldToTable).map(getScores));
	} else if (searchType === 'thief') {
		await Promise.all(Object.values(fieldToTable).map(getScoresForThiefId));
	} else {
		const table = fieldToTable[searchType];
		if (!table) {
			throw new Error(`Unknown search type: ${query.searchType}`);
		}
		await getScores(table);
	}

	const allThiefIds = Array.from(scores.keys());
	if (isSearchTextValid) {
		allThiefIds.sort((a, b) => (scores.get(a) || 0) - (scores.get(b) || 0));
	} else {
		allThiefIds.sort((a, b) => b - a);
	}
	const pagedThiefIds = allThiefIds.slice(offset, offset + MAX_ROW);

	const total = allThiefIds.length;

	return {
		data: await getThiefData(pagedThiefIds),
		meta: {
			totalRows: total,
			totalPages: Math.ceil(total / MAX_ROW)
		}
	};
}


const router = express.Router();
router.get("/", async (req: express.Request, res: express.Response) => {
	try {
		// if (!validToken(req)) {
		// return res.status(401).send("Unauthorized");
		// }


		return res.json(await get(req.query));
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal Server Error");
	}
});
export default router;