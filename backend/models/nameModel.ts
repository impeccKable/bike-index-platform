import { faker } from '@faker-js/faker';
// const { faker } = require('@faker-js/faker');

type Person {
  id: number;
  name: string;
}

const fakeName: any[] = [];
for (let i = 0; i <= 20; i++) {
  const newPerson = {
    id: i + 1,
    name: faker.person.fullName(),
  };
  fakeName.push(newPerson);
}

const nameModel = {};

nameModel.getAll = () => {
  return fakeName;
};

nameModel.addOne = (name, callback) => {
  try {
    const newPerson = {
      id: fakeName.length + 1,
      name: name,
    };
    fakeName.push(newPerson);
    return fakeName;
  } catch (err) {
    return err;
  }
};

nameModel.getByName = (name) => {
  let result = [];
  fakeName.forEach((person) => {
    if (person.name === name) {
      result.push(person);
    }
  });
  return result;
};

// const nameModel = {
//   getAll: (callback) => {
//     return fakeName;
//   },

//   addOne: (name, callback) => {
//     try {
//       const newPerson = {
//         id: fakeName.length + 1,
//         name: name,
//       };
//       fakeName.push(newPerson);
//       return true;
//     } catch (err) {
//       return err;
//     }
//   },

//   getByName: (name, callback) => {
//     let result = new Array();
//     fakeName.forEach((person) => {
//       if (person.name === name) {
//         result.push(person);
//       }
//     });
//     return result;
//   },
// };

// module.exports = nameModel;
export default nameModel;
