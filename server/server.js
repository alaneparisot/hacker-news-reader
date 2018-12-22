require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const db = require('./db/db');
const hackerNewsWorker = require('./workers/hackerNews');

const listRoute = require('./routes/list');
const userRoute = require('./routes/users');

const app = express();
const server = http.Server(app);

const port = process.env.PORT;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api/list', listRoute);
app.use('/api/users', userRoute);

db.connect().then(async () => {
  await hackerNewsWorker.connect();
  console.info('First update of lists and items has been successful.');
});

server.listen(port, () => {
  console.info(`Server is running on port ${port}.`);
});

module.exports = {app};