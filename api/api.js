const apiRouter = require('express').Router();
const employeesRouter = require('./employees');




apiRouter.use('/employees', employeesRouter);


module.exports = apiRouter;