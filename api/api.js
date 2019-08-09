const apiRouter = require('express').Router();
const employeesRouter = require('./employees');
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || '../database.sqlite');



apiRouter.use('/employees', employeesRouter);


module.exports = apiRouter;