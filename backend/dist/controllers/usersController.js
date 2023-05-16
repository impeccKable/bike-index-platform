"use strict";
// /** @format */
// import userModel from '../models/userModel';
// // fake users
// const fakeUsers = [
//   {
//     id: 1,
//     name: 'Fake User1',
//   },
//   {
//     id: 2,
//     name: 'Fake User2',
//   },
// ];
// const usersController = {
//   // handle get
//   getAllFake: (req: any, res: any) => {
//     res.json(fakeUsers);
//   },
//   // handle get
//   // get from db
//   getAll: (req: any, res: any) => {
//     userModel.getAll((err, results, fields) => {
//       if (err) {
//         res.status(500).send('Error getting data from db');
//       } else {
//         res.json(results);
//       }
//     });
//   },
//   // handle get
//   // get from db
//   getById: (req: any, res: any) => {
//     userModel.getById(req.body.id, (err, results, fields) => {
//       if (err) {
//         res.status(500).send('Error getting data from db');
//       } else {
//         res.json(results);
//       }
//     });
//   },
//   // handle post
//   addFake: (req: any, res: any) => {
//     const user = {
//       id: fakeUsers.length + 1,
//       name: req.body.name,
//     };
//     fakeUsers.push(user);
//     res.status(202);
//   },
// };
// export default usersController;
