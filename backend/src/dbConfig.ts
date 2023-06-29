import { config } from './config';

// Create an instance of pg-promise
const pgp = require('pg-promise')();

// Set up a connection configuration
const connectionConfig = {
	host: '54.172.42.84',
	port: 5432,
	database: 'bike_index',
	user: config.dbUser,
	password: config.dbPassword,
};

// Create a database object
const connection = pgp(connectionConfig);

export default connection;
