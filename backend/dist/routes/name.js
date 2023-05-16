"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import express from 'express';
// import { nameController } from '../controllers/nameController';
const express_1 = __importDefault(require("express"));
// import router from 'express.Router';
const nameController_1 = __importDefault(require("../controllers/nameController"));
const router = express_1.default.Router();
// export const name = () => {
//   router.get('/', nameController.getAll);
//   router.get('/search/:name', nameController.getByName);
// };
// const router = express.Router();
// // localhost:3000/name/
router.get('/', nameController_1.default.getAll);
// // localhost:3000/name/search
// router.get('/search/:name', nameController.getByName);
// // localhost:3000/name/
// // router.post('/', nameController.addOne);
exports.default = router;
