import { Request, Response } from 'express';
// import marketplaceModel from '../models/marketplaceModel';

const marketplaceController = {
  getAll: (req: Request, res: Response) => {
    try {
      res.send('dummy get all');
    } catch (err) {
      res.status(500).send('Error getting all from db');
    }
  },
};

export default marketplaceController;
