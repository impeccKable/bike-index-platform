"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const fakeName = [];
for (let i = 0; i <= 20; i++) {
    const newPerson = {
        id: i + 1,
        name: faker_1.faker.person.fullName(),
    };
    fakeName.push(newPerson);
}
// const nameModel = {};
// nameModel.getAll = () => {
//   return fakeName;
// };
// nameModel.addOne = (name, callback) => {
//   try {
//     const newPerson = {
//       id: fakeName.length + 1,
//       name: name,
//     };
//     fakeName.push(newPerson);
//     return fakeName;
//   } catch (err) {
//     return err;
//   }
// };
// nameModel.getByName = (name) => {
//   let result = [];
//   fakeName.forEach((person) => {
//     if (person.name === name) {
//       result.push(person);
//     }
//   });
//   return result;
// };
const nameModel = {
    getAll: () => {
        return fakeName;
    },
    addOne: (name) => {
        try {
            const newPerson = {
                id: fakeName.length + 1,
                name: name,
            };
            fakeName.push(newPerson);
            return true;
        }
        catch (err) {
            return err;
        }
    },
    getByName: (name) => {
        const result = [];
        fakeName.forEach((person) => {
            if (person.name === name) {
                result.push(person);
            }
        });
        return result;
    },
};
// module.exports = nameModel;
exports.default = nameModel;
