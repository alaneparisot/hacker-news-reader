require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
const server = http.Server(app);

const port = process.env.PORT;

app.use(bodyParser.json());

server.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});