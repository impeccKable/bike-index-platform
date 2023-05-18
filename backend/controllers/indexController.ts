/** @format */

import { Request, Response } from 'express';

const indexController = {
  home: (req: Request, res: Response) => {
    res.send('home page');
  },
};

export default indexController;
