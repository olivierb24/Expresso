const employeesRouter = require('express').Router();
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || '../database.sqlite');


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


employeesRouter.post('/', (req, res, next) => {
    const name = req.body.employee.name;
    const position = req.body.employee.position;
    const wage = req.body.employee.wage;
    const isCurrentEmployee = req.body.employee.isCurrentEmployee;
    req.current = isCurrentEmployee === 0? 0 : 1;
    if(!name || !position || !wage || !isCurrentEmployee) {
        res.sendStatus(400);
    } else {
        const sql = `INSERT INTO Employee(name, position, wage, is_current_employee)
                    VALUES($name, $position, $wage, $isCurrentEmployee)`
        const values = {
                        $name: name,
                        $position: position,
                        $wage: wage,
                        $isCurrentEmployee: req.current
                        }
        db.run(sql, values, function(err) {
            if (err) {
                next(err);
            } else {
                const sql2 = `SELECT * FROM Employee WHERE id = ${this.lastID}`
                const values2 = {$id: this.lastID}
                db.get(sql2, (err, row) => {
                    if(err) {
                        next(err);
                    } else {
                        res.status(201).json({employee: row});
                    }
                });
            }
        });
    }
})

module.exports = employeesRouter;