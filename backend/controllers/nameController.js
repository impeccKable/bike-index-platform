// import { nameModel } from '../models/nameModel';
const nameModel = require('../models/nameModel');

const nameController = {};

nameController.getAll = (req, res) => {
  try {
    res.json(nameModel.getAll);
  } catch (err) {
    res.status(500).send('Error getting all from db');
  }
};

nameController.addOne = (req, res) => {
  const { name } = req.body;
  nameModel.addOne(name, (err, results, fields) => {
    if (err) {
      res.status(500).send('Error adding name to db');
    } else {
      res.status(200).send('Successful adding data to db');
    }
  });
};

nameController.getByName = (req, res) => {
  const { name } = req.body;
  nameModel.getByName(name, (err, results, fields) => {
    if (err) {
      res.status(500).send('Error getting data from db');
    } else {
      res.json(results);
    }
  });
};

// const nameController = {
//   getAll: (req, res) => {
//     try {
//       res.json(nameModel.getAll);
//     } catch (err) {
//       res.status(500).send('Error getting all from db');
//     }
//   },

//   addOne: (req, res) => {
//     const { name } = req.body;
//     nameModel.addOne(name, (err, results, fields) => {
//       if (err) {
//         res.status(500).send('Error adding name to db');
//       } else {
//         res.status(200).send('Successful adding data to db');
//       }
//     });
//   },

//   getByName: (req, res) => {
//     const { name } = req.body;
//     nameModel.getByName(name, (err, results, fields) => {
//       if (err) {
//         res.status(500).send('Error getting data from db');
//       } else {
//         res.json(results);
//       }
//     });
//   },
// };

module.exports = nameController;
