/** @format */

const express = require('express');
const path = require('path');

const indexRoutes = require('./routes/index');
const usersRoutes = require('./routes/users');
const nameRoutes = require('./routes/name');

const app = express();

app.use(express.json());

app.use('/', indexRoutes);
app.use('/users', usersRoutes);
app.use('/name', nameRoutes);

module.exports = app;
