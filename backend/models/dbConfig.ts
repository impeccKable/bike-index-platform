/** @format */

// import 'Connection' interface from @types/mysql
import mysql, { Connection } from 'mysql';

const useDb = false;

let connection: Connection | any;

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
