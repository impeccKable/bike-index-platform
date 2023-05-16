#!/usr/bin/env node

/**
 * Module dependencies
 */

// const app = require('../dist/app');
import app from '../app';
import http from 'http';
// const http = require('http');

const port = process.env.PORT || 3000;

app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});
