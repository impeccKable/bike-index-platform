import { Request, Response } from "express";
import statsModel from "../models/statsModel";

const statsController = {
	getAll: async (req: Request, res: Response) => {
		try {
			return res.json(await statsModel.getAll());
		} catch (err) {
			res.status(500).send("Error getting all from db");
		}
	},
};

export default statsController;
