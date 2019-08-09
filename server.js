const express = require('express');
const server = express();
/*Database initiation */
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

/*Imports off all Routers */
const apiRouter = require('./api/api');
server.use('/api', apiRouter);


/*Setup for server to listen to requests*/
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Currently listening on port ${PORT}.`)
})

module.exports = app;