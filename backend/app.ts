/** @format */

import express from 'express';
import index from './routes/index';
import name from './routes/name';
import marketplace from './routes/marketplace';

const port = process.env.PORT || 3000;

const app = express();

app.set('port', port);

app.use(express.json());

app.use('/', index);
app.use('/name', name);
app.use('/marketplace', marketplace);

app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});
