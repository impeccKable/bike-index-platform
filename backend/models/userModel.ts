/** @format */
import { faker } from '@faker-js/faker';

const fakeUser: { id: number; User: string; Password: string }[] = [];
for (let i = 0; i <= 20; i++) {
  const newUser = {
    id: i + 1,
    User: faker.internet.email(),
    Password: faker.internet.password(),
  };
  fakeUser.push(newUser);
}

const userModel = {
  getAll: () => {
    return fakeUser;
  },

  getByUserEmail: (UserEmail: string) => {
    const result: { id: number; User: string; Password: string }[] = [];
    fakeUser.forEach((UserEntry) => {
      if (UserEntry.User === UserEmail) {
        result.push(UserEntry);
      }
    });
    return result;
  },

  deleteUser: (UserEmail: string) => {
    let toBeDeleted:
      | { id: number; User: string; Password: string }
      | undefined = undefined;

    fakeUser.forEach((UserEntry) => {
      if (UserEntry.User === UserEmail) {
        toBeDeleted = UserEntry;
      }
    });

    if (toBeDeleted != undefined) {
      const index = fakeUser.indexOf(toBeDeleted);
      if (index > -1) {
        fakeUser.splice(index, 1);
      }
    }
  },

  addOne: (UserEmail: string, UserPass: string) => {
    try {
      const newUser = {
        id: fakeUser.length + 1,
        User: UserEmail,
        Password: UserPass,
      };
      fakeUser.push(newUser);
    } catch (err) {
      return err;
    }
  },

  changeUserInfo: (email: string, field: string, value: string) => {
    fakeUser.forEach((UserEntry) => {
      if (UserEntry.User === email) {
        try {
          switch (field) {
            case 'email':
              UserEntry.User = value;
              break;
            case 'password':
              UserEntry.Password = value;
              break;
          }
        } catch (err) {
          return err;
        }
      }
    });
  },

  login: (email: string, password: string) => {
    fakeUser.forEach((userEntry) => {
      if (userEntry.User === email) {
        if (userEntry.Password === password) {
          return { user: userEntry, status: 'logged in' };
        } else {
          return { user: null, status: 'password does not match' };
        }
      }
    });
    return { user: null, status: 'user does not exist' };
  },
};

/* import db from './dbConfig';
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
 */
export default userModel;
