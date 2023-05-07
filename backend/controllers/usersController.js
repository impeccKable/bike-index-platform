/** @format */

const userModel = require('../models/userModel');

const usersController = {};

// fake users
let fakeUsers = [
  {
    id: 1,
    name: 'Fake User1',
  },
  {
    id: 2,
    name: 'Fake User2',
  },
];

// handle get
usersController.getAllFake = (req, res) => {
  res.json(fakeUsers);
};

// handle get
// get from db
usersController.getAll = (req, res) => {
  userModel.getAll((err, results, fields) => {
    if (err) {
      res.status(500).send('Error getting data from db');
    } else {
      res.json(results);
    }
  });
};

// handle get
// get from db
usersController.getById = (req, res) => {
  userModel.getById(req.body.id, (err, results, fields) => {
    if (err) {
      res.status(500).send('Error getting data from db');
    } else {
      res.json(results);
    }
  });
};

// handle post
usersController.addFake = (req, res) => {
  const user = {
    id: fakeUsers.length + 1,
    name: req.body.name,
  };

  fakeUsers.push(user);
  res.status(201);
};

module.exports = usersController;
