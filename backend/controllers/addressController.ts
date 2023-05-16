import { Request, Response } from "express";
import addressModel from "../models/addressModel";

const addressController = {
	getAll: (req: Request, res: Response) => {
		try {
			res.json(addressModel.getAll());
		} catch (err) {
			res.status(500).send("Error getting all from db");
		}
	},

	getByStreet: (req: Request, res: Response) => {
		const { street } = req.query;
		if (typeof street === "string") {
			try {
				res.json(addressModel.getByStreet(street));
			} catch (err) {
				res.status(500).send("Err getting street data from db");
			}
		} else {
			res.status(400).send("Invalid street parameter");
		}
	},

	getByCity: (req: Request, res: Response) => {
		const { city } = req.query;
		if (typeof city === "string") {
			try {
				res.json(addressModel.getByCity(city));
			} catch (err) {
				res.status(500).send("Err getting city data from db");
			}
		} else {
			res.status(400).send("Invalid city parameter");
		}
	},

	getByState: (req: Request, res: Response) => {
		const { state } = req.query;
		if (typeof state === "string") {
			try {
				res.json(addressModel.getByState(state));
			} catch (err) {
				res.status(500).send("Err getting state data from db");
			}
		} else {
			res.status(400).send("Invalid state parameter");
		}
	},

	getByZipcode: (req: Request, res: Response) => {
		const { zipcode } = req.query;
		if (typeof zipcode === "string") {
			try {
				res.json(addressModel.getByZipcode(zipcode));
			} catch (err) {
				res.status(500).send("Err getting zipcode data from db");
			}
		} else {
			res.status(400).send("Invalid zipcode parameter");
		}
	},

	addOne: (req: Request, res: Response) => {
		const { street, city, state, zipcode } = req.body;

		try {
			addressModel.addOne(street, city, state, zipcode);
			res.status(200).send("Successful adding link to db");
		} catch (err) {
			res.status(500).send("Error adding link to db");
		}
	},
};

export default addressController;
