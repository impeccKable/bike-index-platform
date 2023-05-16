"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
// const path = require('path');
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
// const indexRoutes = require('./routes/index');
const usersRoutes = require('./routes/users');
const nameRoutes = require('./routes/name');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/', index_1.default);
app.use('/users', usersRoutes);
app.use('/name', nameRoutes);
module.exports = app;
