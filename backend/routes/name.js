// import express from 'express';
// import { nameController } from '../controllers/nameController';
const express = require('express');
const router = express.Router();
const nameController = require('../controllers/nameController');

// localhost:3000/name/
router.get('/', nameController.getAll);

// localhost:3000/name/search
router.get('/search/:name', nameController.getByName);

// localhost:3000/name/
// router.post('/', nameController.addOne);

module.exports = router;
