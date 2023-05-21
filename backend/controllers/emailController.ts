import { Request, Response } from "express";
import emailModel from "../models/emailModel";

const emailController = {
	getAll: (req: Request, res: Response) => {
		try {
			res.json(emailModel.getAll());
		} catch (err) {
			res.status(500).send("Error getting all from db");
		}
	},

	getByEmail: (req: Request, res: Response) => {
		const { email } = req.query;
		if (typeof email === "string") {
			try {
				res.json(emailModel.getByEmail(email));
			} catch (err) {
				res.status(500).send("Err getting email data from db");
			}
		} else {
			res.status(400).send("Invalid email parameter");
		}
	},

	addOne: (req: Request, res: Response) => {
		const { link } = req.body;
		try {
			emailModel.addOne(link);
			res.status(200).send("Successful adding link to db");
		} catch (err) {
			res.status(500).send("Error adding link to db");
		}
	},
};

export default emailController;
