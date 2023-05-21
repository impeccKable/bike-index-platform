import { Request, Response } from 'express';
import phoneModel from '../models/phoneModel';

const phoneController = {
  getAll: (req: Request, res: Response) => {
    try {
      res.json(phoneModel.getAll());
    } catch (err) {
      res.status(500).send('Error getting all phone numbers from db');
    }
  },

  getByPhoneNum: (req: Request, res: Response) => {
    const { phone } = req.query;
    if (typeof phone === 'string') {
      try {
        res.json(phoneModel.getByPhoneNum(phone));
      } catch (err) {
        res.status(500).send('Error getting phone data from db');
      }
    } else {
      res.status(400).send('Invalid phone parameter');
    }
  },

  addOne: (req: Request, res: Response) => {
    const { phone } = req.body;
    try {
      phoneModel.addOne(phone);
      res.status(200).send('Successful adding phone to db');
    } catch (err) {
      res.status(500).send('Error adding phone to db');
    }
  },
};

export default phoneController;
