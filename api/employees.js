const employeesRouter = require('express').Router();
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');


employeesRouter.get('/', (req, res, next) => {
    db.all(`SELECT * FROM Employee WHERE is_current_employee = 1`,
            (err, employees) => {
                if (err) {
                    next(err);
                } else {
                    res.status(200).json({employees: employees});
                }
            });
})

module.exports = employeesRouter;