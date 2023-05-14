// import express from 'express';
// import { nameController } from '../controllers/nameController';
const express = require('express');
const router = express.Router();
const nameController = require('../controllers/nameController');

// localhost:5000/name/
router.get('/', nameController.getAll);
//
router.get('/search', nameController.getByName);
// localhost:5000/name/
router.post('/', nameController.addOne);

module.exports = router;
