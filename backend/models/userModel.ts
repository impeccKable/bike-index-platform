/** @format */
import { faker } from "@faker-js/faker";

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
