import { faker } from "@faker-js/faker";

const fakeAddress: {
	id: number;
	street: string;
	city: string;
	state: string;
	zipCode: string;
}[] = [];

for (let i = 0; i <= 20; i++) {
	const newAddress = {
		id: i + 1,
		street: faker.location.streetAddress(),
		city: faker.location.city(),
		state: faker.location.state(),
		zipCode: faker.location.zipCode(),
	};
	fakeAddress.push(newAddress);
}

const addressModel = {
	getAll: () => {
		return fakeAddress;
	},

	getByStreet: (street: string) => {
		const result: {
			id: number;
			street: string;
			city: string;
			state: string;
			zipCode: string;
		}[] = [];
		fakeAddress.forEach((streetEntry) => {
			if (streetEntry.street === street) {
				result.push(streetEntry);
			}
		});
		return result;
	},

	getByCity: (city: string) => {
		const result: {
			id: number;
			street: string;
			city: string;
			state: string;
			zipCode: string;
		}[] = [];
		fakeAddress.forEach((cityEntry) => {
			if (cityEntry.city === city) {
				result.push(cityEntry);
			}
		});
		return result;
	},

	getByState: (state: string) => {
		const result: {
			id: number;
			street: string;
			city: string;
			state: string;
			zipCode: string;
		}[] = [];
		fakeAddress.forEach((stateEntry) => {
			if (stateEntry.state === state) {
				result.push(stateEntry);
			}
		});
		return result;
	},

	getByZipcode: (zipCode: string) => {
		const result: {
			id: number;
			street: string;
			city: string;
			state: string;
			zipCode: string;
		}[] = [];
		fakeAddress.forEach((zipCodeEntry) => {
			if (zipCodeEntry.zipCode === zipCode) {
				result.push(zipCodeEntry);
			}
		});
		return result;
	},

	addOne: (street: string, city: string, state: string, zipCode: string) => {
		try {
			const newAddress = {
				id: fakeAddress.length + 1,
				street,
				city,
				state,
				zipCode,
			};
			fakeAddress.push(newAddress);
		} catch (err) {
			return err;
		}
	},
};

export default addressModel;
