import axios, { AxiosInstance, AxiosResponse } from "axios";

const serverIP   = import.meta.env.VITE_APIHOST;
const serverPort = import.meta.env.VITE_PORT;

const serverUrl = `http://${serverIP}:${serverPort}`;

const httpClient = axios.create({
	baseURL: serverUrl,
	headers: {
		"Content-type": "application/json",
	},
});

export { httpClient };
