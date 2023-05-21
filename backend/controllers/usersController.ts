/** @format */

import userModel from "../models/userModel";
import { Request, Response } from "express";

// fake users

const usersController = {
	// handle get
	getAll: (req: Request, res: Response) => {
		try {
			res.json(userModel.getAll());
		} catch (err) {
			res.status(500).send("Error getting data from the db");
		}
	},

	// handle get
	// get from db
	getByEmail: (req: Request, res: Response) => {
		let { email } = req.body;
		try {
			res.json(userModel.getByUserEmail(email));
		} catch (err) {
			res.status(500).send("Error getting data from the db");
		}
	},

	deleteUser: (req: Request, res: Response) => {
		let { email } = req.body;
		try {
			res.json(userModel.deleteUser(email));
		} catch (err) {
			res.status(500).send("Error deleting user from db");
		}
	},

	// handle post
	addFake: (req: Request, res: Response) => {
		let { email, password } = req.body;
		try {
			res.json(userModel.addOne(email, password));
		} catch (err) {
			res.status(500).send("Error getting data from the db");
		}
	},

	//handle change info
	changeUserInfo: (req: Request, res: Response) => {
		let { email, field, value } = req.body;
		try {
			res.json(userModel.changeUserInfo(email, field, value));
		} catch (err) {
			res.status(500).send("Error changing user data in the db");
		}
	},
};

export default usersController;
