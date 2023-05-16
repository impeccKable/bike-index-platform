import { faker } from '@faker-js/faker';

// type Person = {
//   id: number;
//   name: string;
// };

// we can als do this:
//
// const fakeName: Array<Person> = [];
const fakeName: { id: number; name: string }[] = [];
for (let i = 0; i <= 20; i++) {
  const newPerson = {
    id: i + 1,
    name: faker.person.fullName(),
  };
  fakeName.push(newPerson);
}

const nameModel = {
  getAll: () => {
    return fakeName;
  },

  addOne: (name: string) => {
    try {
      const newPerson = {
        id: fakeName.length + 1,
        name: name,
      };
      fakeName.push(newPerson);
      return true;
    } catch (err) {
      return err;
    }
  },

  getByName: (name: string) => {
    const result: { id: number; name: string }[] = [];
    fakeName.forEach((person) => {
      if (person.name === name) {
        result.push(person);
      }
    });
    return result;
  },
};

export default nameModel;
