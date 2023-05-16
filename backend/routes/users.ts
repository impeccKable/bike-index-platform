/** @format */

import express from 'express';
import usersController from '../controllers/usersController';

const router = express.Router();

router.get('/', usersController.getAll); //no db yet
router.get('/:id(\\d+)', usersController.getById); // no db yet
router.get('/fake', usersController.getAllFake);
router.post('/', usersController.addFake);

export default router;
