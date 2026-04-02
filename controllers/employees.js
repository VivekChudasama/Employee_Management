const employeemodel = require('../models/employees');
const { path } = require('../routes');

exports.getEmployees = (req, res, next) => {
    employeemodel.findAll()
        .then(employees => {
            res.render('employees/employees_list', {
                pageTitle: 'Employees',
                employees: employees,
                path: '/employees'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getAddEmployees = (req, res, next) => {
    res.render('employees/add_employee', {
        pageTitle: 'Add Employee',
        path: '/add-employee',
        editing : false
    });
}

exports.postAddEmployee = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const role = req.body.role_id;
    const status = req.body.status;

    req.user.createEmployee({ 
        name: name,
        email: email,
        role_id: role,
        status: status
    })
    .then(() => {
        res.redirect('/employees');
    })
    .catch(err => {
        console.log(err);
    });
}
