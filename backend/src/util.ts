
export const withLowercaseKeys = (obj: any) => {
	for (let key in obj) {
		let newKey = key.toLowerCase();
		if (newKey !== key) {
			obj[newKey] = obj[key];
			delete obj[key];
		}
	}
	return obj;
}
