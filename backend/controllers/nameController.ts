import { Request, Response } from 'express';
import nameModel from '../models/nameModel';

const nameController = {
  getAll: (req: Request, res: Response) => {
    try {
      res.json(nameModel.getAll());
    } catch (err) {
      res.status(500).send('Error getting all from db');
    }
  },

  addOne: (req: Request, res: Response) => {
    const { name } = req.body;
    try {
      nameModel.addOne(name);
      res.status(200).send('Successful adding data to db');
    } catch (err) {
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

  getByName: (req: Request, res: Response) => {
    const { name } = req.query;
    if (typeof name === 'string') {
      try {
        res.json(nameModel.getByName(name));
      } catch (err) {
        res.status(500).send('Err getting data from db');
      }
    } else {
      res.status(400).send('Invalid name parameter');
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

export default nameController;
