import employeemodel from '../models/employees.js';
import departmentModel from '../models/department.js';
import roleModel from '../models/roles.js';

import { AppDataSource } from '../util/database.js';
import { Like } from "typeorm";

const employeeRepository = AppDataSource.getRepository(employeemodel);
const departmentRepository = AppDataSource.getRepository(departmentModel);
const roleRepository = AppDataSource.getRepository(roleModel);

const getEmployees = async (req, res, next) => {
    try {
        const { search, ajax} = req.query;

        let findOptions = {
            relations: ["role", "role.department"]
        };

        if (search) {
            findOptions.where = [
                { name: Like(`%${search}%`) },
                { email: Like(`%${search}%`) },
                { role: { role: Like(`%${search}%`) } },
            ]
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
        // res.send(employees);
    }
    catch (err) {
        console.log(err);
        if (req.query.ajax) return res.status(500).json({ error: "Server error" });
        next(err);
    }
};


const getAddEmployees = (req, res, next) => {
    try {
        departmentRepository.find()
            .then(departments => {
                res.render('employees/add_employee', {
                    pageTitle: 'Add Employee',
                    path: '/add-employee',
                    departments: departments,
                    editing: false
                });
            })
    }
    catch { (err => console.log(err)) };
};

const postAddEmployee = (req, res, next) => {
    const { name, email, department_id, role_name, salary, joining_date, status } = req.body;

    // First create the role
    roleRepository.insert({
        role: role_name,
        salary: salary,
        Department_id: department_id
    })
        .then(newRole => {
            // Then create the employee
            return employeeRepository.insert({
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


const getEditEmployee = (req, res, next) => {
    const editMode = req.query.edit;
    const empId = req.params.employeeId;

    let fetchedDepartments;
    departmentRepository.find()
        .then(departments => {
            fetchedDepartments = departments;
            return employeeRepository.findBy(empId, { include: [{ model: roleModel }] });
        })
        .then(employee => {
            if (!employee) {
                return res.redirect('/employees');
            }
            res.render('employees/edit_employee', {
                pageTitle: 'Edit Employee',
                path: '/edit-employee',
                employee: employee,
                departments: fetchedDepartments,
                editing: true
            });
        })
        .catch(err => console.log(err));
};

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

            return employee.role.save().then(() => employee.save());
        })
        .then(() => {
            res.redirect('/employees');
        })
        .catch(err => console.log(err));
};

const deleteEmployee = (req, res, next) => {
    const empId = req.params.employeeId;

    if(roleRepository.count({ employeeId: empId })) {
        return res.status(400).send({ message: "Cannot delete employee with assigned role" });
    }

    employeeRepository.delete({ id: empId })

        .then(result => {
            if (result.affected === 0) {
                return res.status(404).send({ message: 'Employee ID not found' });
            }
            console.log('Employee deleted');
            res.send({ message: 'Employee deleted' });
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