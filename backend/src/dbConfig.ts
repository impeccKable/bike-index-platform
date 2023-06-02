
// Create an instance of pg-promise
const pgp = require('pg-promise')();

// Set up a connection configuration
const connectionConfig = {
  host: '54.172.42.84',
  port: 5432,
  database: 'bike_index',
  user: 'ec2-user',
  password: '3P7&!zrq5B',
};

// Create a database object
const connection = pgp(connectionConfig);

export default connection;
