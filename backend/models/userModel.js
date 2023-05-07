/** @format */

const db = require('./dbConfig');

const userModel = {};

userModel.getAll = (theCallbackFromController) => {
  const query = 'SELECT * FROM userTable';
  db.query(query, theCallbackFromController);
};

userModel.getById = (id, callback) => {
  const query = 'SELECT * FROM userTable WHERE id = ?';
  db.query(query, [id], callback);
};

module.exports = userModel;
