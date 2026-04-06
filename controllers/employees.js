import employeemodel from '../models/employees.js';
import departmentModel from '../models/department.js';
import roleModel from '../models/roles.js';

import { AppDataSource } from '../util/database.js';

const employeeRepository = AppDataSource.getRepository(employeemodel);
const departmentRepository = AppDataSource.getRepository(departmentModel);
const roleRepository = AppDataSource.getRepository(roleModel);

import { Like } from "typeorm";

//get list of employees with search support 
const getEmployees = async (req, res, next) => {
    try {
        const { search, ajax } = req.query;

        let findOptions = {
            relations: ["role", "role.department"]
        };

        if (search) {
            findOptions.where = [
                { name: Like(`%${search}%`) },
                { email: Like(`%${search}%`) },
                { role: { role: Like(`%${search}%`) } }
            ];
        }

        const employees = await employeeRepository.find(findOptions);

        if (ajax) {
            return res.json(employees);
        }

        res.render('employees/employees_list', {
            pageTitle: 'Employees',
            employees: employees,
            path: '/employees'
        });
    } catch (err) {
        console.log(err);
        if (req.query.ajax) return res.status(500).json({ error: "Server error" });
        next(err);
    }
};

// Render add employee form
const getAddEmployees = (req, res, next) => {
    departmentRepository.find()
        .then(departments => {
            // res.render('employees/add_employee', {
            //     pageTitle: 'Add Employee',
            //     path: '/add-employee',
            //     departments: departments,
            //     editing: false
            // });
            res.status(200).json({
                message: 'Render add employee form',
                departments: departments
            });
        })
        .catch(err => console.log(err));
};

// Handle add employee form submission
const postAddEmployee = (req, res, next) => {
    const { name, email, department_id, role_name, salary, joining_date, status } = req.body;

    // First create the role
    return roleRepository.save({
        role: role_name,
        salary: salary,
        Department_id: department_id
    })
        .then(async newRole => {
            // Then create the employee
            return await employeeRepository.create({
                name: name,
                email: email,
                role_id: newRole.id,
                joining_date: joining_date || null,
                status: status
            });
        })
        .then(() => {
            res.redirect('/employees');
        })
        .catch(err => console.log(err));
};

// Render edit employee form with employee data and list of departments for dropdown
const getEditEmployee = (req, res, next) => {
    const editMode = req.query.edit;
    const empId = req.params.employeeId;

    employeeRepository.findBy({ id: empId }, { relations: ["role"] })
        .then(employee => {
            if (!employee) {
                return res.redirect('/employees');
            }
            //    res.render('employees/edit_employee', {
            //         pageTitle: 'Edit Employee',
            //         path: '/edit-employee',
            //         employee: employee,
            //         departments: fetchedDepartments,
            //         editing: editMode
            //     }); 
            res.status(200).json({ employee: employee, message: 'Render edit employee form' });
        })
        .catch(err => console.log(err));
};

// Handle edit employee form submission
const editEmployee = (req, res, next) => {
    const { employeeId, name, email, department_id, role_name, salary, joining_date, status } = req.body;

    employeeRepository.findBy(employeeId, { include: [{ model: roleModel }] })
        .then(employee => {
            if (!employee) return res.redirect('/employees');

            employee.name = name;
            employee.email = email;
            employee.status = status;
            employee.joining_date = joining_date || null;

            // Also update the role
            employee.role.role = role_name;
            employee.role.salary = salary;
            employee.role.Department_id = department_id;

            return employee.role.update().then(() => employee.update());
        })
        .then(() => {
            res.redirect('/employees');
        })
        .catch(err => console.log(err));
};

// Handle delete employee request
const deleteEmployee = (req, res, next) => {
    const empId = req.body.employeeId;
    employeeRepository.findBy(empId, { include: [{ model: roleModel }] })
        .then(employee => {
            if (!employee) return res.redirect('/employees');

            // Delete employee, then delete their role
            const role = employee.role;
            return employee.delete().then(() => {
                if (role) {
                    return role.delete();
                }
            });
        })
        .then(() => {
            res.redirect('/employees');
        })
        .catch(err => console.log(err));
};

export default {
    getEmployees,
    getAddEmployees,
    postAddEmployee,
    getEditEmployee,
    editEmployee,
    deleteEmployee
};