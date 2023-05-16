"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const useDb = false;
let connection;
if (useDb) {
    connection = mysql_1.default.createConnection({
        host: 'localhost',
        user: 'dbuser',
        password: 'my_password',
        database: 'my_db',
    });
}
else {
    connection = {
    /* use test db */
    };
}
exports.default = connection;
