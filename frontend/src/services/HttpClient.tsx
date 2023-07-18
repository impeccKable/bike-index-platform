import axios from 'axios';

const env = import.meta.env;
let protocol = env.VITE_MODE === 'prod' ? 'https' : 'http';

const httpClient = axios.create({
	baseURL: `${protocol}://${env.VITE_APIHOST}/api`,
	headers: {
		'Content-type': 'application/json',
	},
});

export { httpClient };
