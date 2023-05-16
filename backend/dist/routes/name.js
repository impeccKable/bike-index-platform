"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = void 0;
// import router from 'express.Router';
const nameController_1 = __importDefault(require("../controllers/nameController"));
const name = (app) => {
    app.get('/', nameController_1.default.getAll);
    app.get('/search/:name', nameController_1.default.getByName);
};
exports.name = name;
// const router = express.Router();
// // localhost:3000/name/
// router.get('/', nameController.getAll);
// // localhost:3000/name/search
// router.get('/search/:name', nameController.getByName);
// // localhost:3000/name/
// // router.post('/', nameController.addOne);
// export default router;
