"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nameController_1 = __importDefault(require("../controllers/nameController"));
const router = express_1.default.Router();
// // localhost:3000/name/
router.get('/', nameController_1.default.getAll);
// localhost:3000/name/search
router.get('/search/:name', nameController_1.default.getByName);
router.post('/', nameController_1.default.addOne);
exports.default = router;
