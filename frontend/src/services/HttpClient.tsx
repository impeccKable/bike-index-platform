import axios from 'axios';

const env = import.meta.env;

const httpClient = axios.create({
  baseURL: `http://${env.VITE_BACKEND_HOST}`,
  headers: {
    'Content-type': 'application/json',
  },
});

export { httpClient };
