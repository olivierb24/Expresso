const timesheetsRouter = require('express').Router({mergeParams: true});
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || '../database.sqlite');

const checkValidTimesheet = (req, res, next) => {
    req.hours = req.body.timesheet.hours;
    req.rate = req.body.timesheet.rate;
    req.date = req.body.timesheet.date;
    req.employeeId = req.params.employeeId;
    if(!req.hours || !req.rate || !req.date) {
        return res.sendStatus(400);
    } else{
        next();
    }
}


timesheetsRouter.use('timesheetId', (req, res, next, timesheetId) => {
    const sql = `SELECT * FROM Timesheet WHERE id = $id AND employee_id = $employeeId`;
    const value = {$id: timesheetId, $employeeId: req.params.employeeId};
    db.get(sql, value, (err, row) => {
        if (err) {
            next(err)
        } else if (row) {
            req.timesheet = row;
            next()
        } else {
            res.sendStatus(404);
        }
    })
})



timesheetsRouter.get('/', (req, res, next) => {
    const sql = `SELECT * FROM Timesheet WHERE employee_id = $employeeId`;
    const values = {$employeeId: req.params.employeeId};
    db.all(sql, values, (err, rows) => {
        if(err){
            next(err);
        } else {
            res.status(200).json({timesheets: rows});
        }
    });
})

timesheetsRouter.post('/', checkValidTimesheet, (req, res, next) => {
    const sql = `INSERT INTO Timesheet (hours, rate, date, employee_id)
                VALUES($hours, $rate, $date, $employeeId)`;
    const values = {$hours: req.hours, $rate: req.rate, $date: req.date, $employeeId: req.employeeId};
    db.run(sql, values, function(err) {
        if(err){
            next(err);
        } else {
            const sql2 = `SELECT * FROM Timesheet WHERE id = $id`;
            const values2 = {$id: this.lastID};
            db.get(sql2, values2, (err, row) => {
                if (err){
                    next(err);
                } else {
                    res.status(201).json({timesheet: row});
                }
            });
        }
    });
})


timesheetsRouter.put('/:timesheetId', checkValidTimesheet, (req, res, next) => {
    const sql = `UPDATE Timesheet
                SET hours = $hours, rate = $rate, date = $date
                WHERE id = $timesheetId AND employee_id = $employeeId`;
    const values = {$hours: req.hours, $rate: req.hours, $date: req.date, $timesheetId: req.params.timesheetId, $employeeId: req.employeeId};
    db.run(sql, values, (err) => {
        if (err) {
            next(err);
        } else {
            const sql2 = `SELECT * FROM Timesheet WHERE id = $timesheetId AND employee_id = $employeeId`;
            const values2 = {$timesheetId: req.params.timesheetId, $employeeId: req.employeeId};
            db.get(sql2, values2, (err, row) => {
                if (err) {
                    next(err);
                } else {
                    res.status(200).json({timesheet: row});
                }
            });
        }
    });

})


module.exports = timesheetsRouter;