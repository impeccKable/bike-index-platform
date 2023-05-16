/** @format */

// const express = require('express');
// const router = express.Router();
// const indexController = require('../controllers/indexController');
import * as express from 'express';
import indexController from '../controllers/indexController';

const router = express.Router();
// export const index = (app: express.Application) => {
//   app.get('/', indexController.home);
// };

router.get('/', indexController.home);

// module.exports = router;
export default router;
