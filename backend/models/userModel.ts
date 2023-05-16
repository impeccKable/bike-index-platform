/** @format */

import db from './dbConfig';
import { queryCallback } from 'mysql';

const userModel = {
  getAll: (theCallbackFromController: queryCallback) => {
    const query = 'SELECT * FROM userTable';
    db.query(query, theCallbackFromController);
  },

  getById: (id: number, callback: queryCallback) => {
    const query = 'SELECT * FROM userTable WHERE id = ?';
    db.query(query, [id], callback);
  },
};

export default userModel;
