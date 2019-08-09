const express = require('express');
const server = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const cors = require('cors');
/*Database initiation */
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');


server.use(morgan('dev'));
server.use(bodyParser.json());
server.use(errorHandler());
server.use(cors());

const apiRouter = require('./api/api');
server.use('/api', apiRouter);

/*Setup for server to listen to requests*/
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Currently listening on port ${PORT}.`)
})

module.exports = server;