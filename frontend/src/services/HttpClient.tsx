import axios from 'axios';

const env = import.meta.env;

const httpClient = axios.create({
  baseURL: `http://${env.VITE_APIHOST}:${env.VITE_PORT}`,
  headers: {
    'Content-type': 'application/json',
  },
});

export { httpClient };
