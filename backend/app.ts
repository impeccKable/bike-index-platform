/** @format */

import express from 'express';
// import http from 'http';

import { index } from './routes/index';
import { name } from './routes/name';

const port = process.env.PORT || 3000;

const app = express();

app.set('port', port);

// const server = http.createServer(app);

app.use(express.json());

app.use('/', index);
app.use('/name', name);

app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});
export default app;
