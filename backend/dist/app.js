"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const name_1 = __importDefault(require("./routes/name"));
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.set('port', port);
app.use(express_1.default.json());
app.use('/', index_1.default);
app.use('/name', name_1.default);
app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
});
