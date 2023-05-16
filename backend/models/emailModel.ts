import { faker } from "@faker-js/faker";

const fakeEmail: { id: number; email: string }[] = [];
for (let i = 0; i <= 20; i++) {
	const newemail = {
		id: i + 1,
		email: faker.internet.email(),
	};
	fakeEmail.push(newemail);
}

const emailModel = {
	getAll: () => {
		return fakeEmail;
	},

	getByEmail: (email: string) => {
		const result: { id: number; email: string }[] = [];
		fakeEmail.forEach((emailEntry) => {
			if (emailEntry.email === email) {
				result.push(emailEntry);
			}
		});
		return result;
	},

	addOne: (email: string) => {
		try {
			const newEmail = {
				id: fakeEmail.length + 1,
				email: email,
			};
			fakeEmail.push(newEmail);
		} catch (err) {
			return err;
		}
	},
};

export default emailModel;
