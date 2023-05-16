"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
// const router = express.Router();
// const indexController = require('../controllers/indexController');
const express_1 = __importDefault(require("express"));
const indexController_1 = __importDefault(require("../controllers/indexController"));
const router = express_1.default.Router();
// export const index = (app: express.Application) => {
//   app.get('/', indexController.home);
// };
router.get('/', indexController_1.default.home);
// module.exports = router;
exports.default = router;
