/** @format */

import mysql from 'mysql';

const useDb = false;

let connection;

if (useDb) {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'dbuser',
    password: 'my_password',
    database: 'my_db',
  });
} else {
  connection = {
    /* use test db */
  };
}

export default connection;
