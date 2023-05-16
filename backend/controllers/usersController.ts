/** @format */

import userModel from '../models/userModel';
import { Request, Response } from 'express';

// fake users
const fakeUsers = [
  {
    id: 1,
    name: 'Fake User1',
  },
  {
    id: 2,
    name: 'Fake User2',
  },
];

const usersController = {
  // handle get
  getAllFake: (req: Request, res: Response) => {
    res.json(fakeUsers);
  },

  // handle get
  // get from db
  getAll: (req: Request, res: Response) => {
    userModel.getAll((err, results, fields) => {
      if (err) {
        res.status(500).send('Error getting data from db');
      } else {
        res.json(results);
      }
    });
  },

  // handle get
  // get from db
  getById: (req: Request, res: Response) => {
    const { id } = req.query;

    if (typeof id === 'string') {
      const parsedId = parseInt(id, 10);
      userModel.getById(parsedId, (err, results, fields) => {
        if (err) {
          res.status(500).send('Error getting data from db');
        } else {
          res.json(results);
        }
      });
    } else {
      res.status(400).send('Invalid id parameter');
    }
  },

  // handle post
  addFake: (req: Request, res: Response) => {
    const user = {
      id: fakeUsers.length + 1,
      name: req.body.name,
    };

    fakeUsers.push(user);
    res.status(202);
  },
};

export default usersController;
