/** @format */

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/', usersController.getAll); //no db yet
router.get('/:id(\\d+)', usersController.getById); // no db yet
router.get('/fake', usersController.getAllFake);
router.post('/', usersController.addFake);

module.exports = router;
