import { Request, Response } from 'express';
import marketplaceModel from '../models/marketplaceModel';

const marketplaceController = {
  getAll: (req: Request, res: Response) => {
    try {
      res.json(marketplaceModel.getAll());
    } catch (err) {
      res.status(500).send('Error getting all from db');
    }
  },

  getByLink: (req: Request, res: Response) => {
    const { link } = req.query;
    if (typeof link === 'string') {
      try {
        res.json(marketplaceModel.getByLink(link));
      } catch (err) {
        res.status(500).send('Err getting link data from db');
      }
    } else {
      res.status(400).send('Invalid link parameter');
    }
  },

  addOne: (req: Request, res: Response) => {
    const { link } = req.body;
    try {
      marketplaceModel.addOne(link);
      res.status(200).send('Successful adding link to db');
    } catch (err) {
      res.status(500).send('Error adding link to db');
    }
  },
};

export default marketplaceController;
