"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
// type Person = {
//   id: number;
//   name: string;
// };
const fakeName = [];
for (let i = 0; i <= 20; i++) {
    const newPerson = {
        id: i + 1,
        name: faker_1.faker.person.fullName(),
    };
    fakeName.push(newPerson);
}
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
exports.default = nameModel;
