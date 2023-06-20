import dotenv from 'dotenv';

dotenv.config();

const { DB_USER, DB_PASSWORD } = process.env;

if (DB_USER === undefined || DB_PASSWORD === undefined) {
  throw new Error('Missing necessary environment variables');
}

export const config = {
  dbUser: DB_USER,
  dbPassword: DB_PASSWORD,
};
