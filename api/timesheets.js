const timesheetsRouter = require('express').Router({mergeParams: true});
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || '../database.sqlite');

timesheetsRouter.get('/', (req, res, next) => {
    const sql = `SELECT * FROM TimeSheet WHERE employee_id = $employeeId`;
    const values = {$employeeId: req.params.employeeId};
    db.all(sql, values, (err, rows) => {
        if(err){
            next(err);
        } else {
            res.status(200).json({timesheets: rows});
        }
    });
})


module.exports = timesheetsRouter;