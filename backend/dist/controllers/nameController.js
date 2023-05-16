"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nameModel_1 = __importDefault(require("../models/nameModel"));
const nameController = {
    getAll: (req, res) => {
        try {
            res.json(nameModel_1.default.getAll());
        }
        catch (err) {
            res.status(500).send('Error getting all from db');
        }
    },
    addOne: (req, res) => {
        const { name } = req.body;
        try {
            nameModel_1.default.addOne(name);
            res.status(200).send('Successful adding data to db');
        }
        catch (err) {
            res.status(500).send('Error adding name to db');
        }
        // if mysql express plugin is used, we would use the function like this
        //
        // nameModel.addOne(name, (err, results, fields) => {
        //   if (err) {
        // res.status(500).send('Error adding name to db');
        //   } else {
        // res.status(200).send('Successful adding data to db');
        //   }
        // });
    },
    getByName: (req, res) => {
        const { name } = req.body;
        try {
            res.send(nameModel_1.default.getByName(name));
        }
        catch (err) {
            res.status(500).send('Err getting data from db');
        }
        // if mysql express plugin is used, we would use the function like this
        //
        // nameModel.getByName(name, (err, results, fields) => {
        //   if (err) {
        //     res.status(500).send('Error getting data from db');
        //   } else {
        //     res.json(results);
        //   }
        // });
    },
};
exports.default = nameController;
