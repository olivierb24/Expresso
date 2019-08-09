const express = require('express');
const server = express();
/*Database initiation */
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');


const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Currently listening on port ${PORT}.`)
})




module.exports = app;