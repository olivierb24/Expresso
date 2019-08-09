const employeesRouter = require('express').Router();
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || '../database.sqlite');

/*Verifies that the requested employee exists and attaches it to req.employee */
employeesRouter.param('employeeId', (req, res, next, employeeId) =>{
    db.get(`SELECT * FROM Employee WHERE id = ${employeeId}`,
    (err, row) => {
        if (err) {
            next(err);
        } else if (row) {
            req.employee = row;
            next();
        } else {
            res.sendStatus(404);
        }
    })
})


const checkValidEmployee = (req, res, next) => {
    req.name = req.body.employee.name;
    req.position = req.body.employee.position;
    req.wage = req.body.employee.wage;
    req.isCurrentEmployee = req.body.employee.isCurrentEmployee;
    if(!req.name || !req.position || !req.wage) {
        return res.sendStatus(400);
    } else{
        next();
    }
}



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


employeesRouter.get('/:employeeId', (req, res, next) => {
    res.status(200).send({employee: req.employee});
})


employeesRouter.post('/', checkValidEmployee, (req, res, next) => {
    req.isCurrentEmployee = req.isCurrentEmployee === 0? 0 : 1;
    const sql = `INSERT INTO Employee(name, position, wage, is_current_employee)
                VALUES($name, $position, $wage, $isCurrentEmployee)`
    const values = {
        $name: req.name,
        $position: req.position,
        $wage: req.wage,
        $isCurrentEmployee: req.isCurrentEmployee
    }
    db.run(sql, values, function(err) {
        if (err) {
            next(err);
        } else {
            const sql2 = `SELECT * FROM Employee WHERE id = $id`
            const values2 = {$id: this.lastID}
            db.get(sql2, values2, (err, row) => {
                if(err) {
                    next(err);
                } else {
                    res.status(201).json({employee: row});
                }
            });
        }
    });
})






module.exports = employeesRouter;