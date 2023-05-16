"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const indexController_1 = __importDefault(require("../controllers/indexController"));
const index = (app) => {
    app.get('/', indexController_1.default.home);
};
exports.index = index;
// router.get('/', indexController.home);
// module.exports = router;
// export default router;
