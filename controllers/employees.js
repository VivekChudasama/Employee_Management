import employeemodel from '../models/employees.js';
import departmentModel from '../models/department.js';
import roleModel  from '../models/roles.js';

const getEmployees = (req, res, next) => {
        employeemodel.find({ include: [{ model: roleModel, include: [departmentModel] }] })
            .then(employees => {
                res.render('employees/employees_list', {
                    pageTitle: 'Employees',
                    employees: employees,
                    path: '/employees'
                });
                res.send(employees);
            })
            .catch(err => console.log(err));
    }


// exports.getAddEmployees = (req, res, next) => {
//     departmentModel.find()
//         .then(departments => {
//             res.render('employees/add_employee', {
//                 pageTitle: 'Add Employee',
//                 path: '/add-employee',
//                 departments: departments,
//                 editing: false
//             });
//         })
//         .catch(err => console.log(err));
// };

// exports.postAddEmployee = (req, res, next) => {
//     const { name, email, department_id, role_name, salary, joining_date, status } = req.body;

//     // First create the role
//     roleModel.create({
//         role: role_name,
//         salary: salary,
//         Department_id: department_id
//     })
//         .then(newRole => {
//             // Then create the employee
//             return employeemodel.create({
//                 name: name,
//                 email: email,
//                 role_id: newRole.id,
//                 joining_date: joining_date || null,
//                 status: status
//             });
//         })
//         .then(() => {
//             res.redirect('/employees');
//         })
//         .catch(err => console.log(err));
// };

// exports.getEditEmployee = (req, res, next) => {
//     const editMode = req.query.edit;
//     const empId = req.params.employeeId;

//     let fetchedDepartments;
//     departmentModel.find()
//         .then(departments => {
//             fetchedDepartments = departments;
//             return employeemodel.findByPk(empId, { include: [{ model: roleModel }] });
//         })
//         .then(employee => {
//             if (!employee) {
//                 return res.redirect('/employees');
//             }
//             res.render('employees/edit_employee', {
//                 pageTitle: 'Edit Employee',
//                 path: '/edit-employee',
//                 employee: employee,
//                 departments: fetchedDepartments,
//                 editing: true
//             });
//         })
//         .catch(err => console.log(err));
// };

// exports.postEditEmployee = (req, res, next) => {
//     const { employeeId, name, email, department_id, role_name, salary, joining_date, status } = req.body;

//     employeemodel.findByPk(employeeId, { include: [{ model: roleModel }] })
//         .then(employee => {
//             if (!employee) return res.redirect('/employees');
            
//             employee.name = name;
//             employee.email = email;
//             employee.status = status;
//             employee.joining_date = joining_date || null;

//             // Also update the role
//             employee.role.role = role_name;
//             employee.role.salary = salary;
//             employee.role.Department_id = department_id;

//             return employee.role.save().then(() => employee.save());
//         })
//         .then(() => {
//             res.redirect('/employees');
//         })
//         .catch(err => console.log(err));
// };

// exports.postDeleteEmployee = (req, res, next) => {
//     const empId = req.body.employeeId;
//     employeemodel.findByPk(empId, { include: [{ model: roleModel }] })
//         .then(employee => {
//             if (!employee) return res.redirect('/employees');

//             // Delete employee, then delete their tied role
//             const role = employee.role;
//             return employee.destroy().then(() => {
//                 if (role) {
//                     return role.destroy();
//                 }
//             });
//         })
//         .then(() => {
//             res.redirect('/employees');
//         })
//         .catch(err => console.log(err));
// };


export default {
    getEmployees
    // getAddEmployees,
    // postAddEmployee,
    // getEditEmployee,
    // postEditEmployee,
    // postDeleteEmployee
};