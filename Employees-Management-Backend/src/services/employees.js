import employeeModel from '../entities/employees.js';
import departmentModel from '../entities/department.js';
import roleModel from '../entities/roles.js';
import { AppDataSource } from '../util/database.js';
import { Like, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";

const employeeRepository = AppDataSource.getRepository(employeeModel);
const departmentRepository = AppDataSource.getRepository(departmentModel);
const roleRepository = AppDataSource.getRepository(roleModel);

// Get all employees with optional search & filters
const findAllEmployees = async ({ search, department_id, status, min_salary, max_salary }) => {
    let findOptions = {
        relations: ["role", "role.department"]
    };

    let Filter = {};
    if (status) {
        Filter.status = status;
    }

    let roleFilter = {};
    if (department_id) {
        roleFilter.department_id = parseInt(department_id);
    }

    if (min_salary && max_salary) {
        roleFilter.salary = Between(parseInt(min_salary), parseInt(max_salary));
    } else if (min_salary) {
        roleFilter.salary = MoreThanOrEqual(parseInt(min_salary));
    } else if (max_salary) {
        roleFilter.salary = LessThanOrEqual(parseInt(max_salary));
    }

    if (Object.keys(roleFilter).length > 0) {
        Filter.role = roleFilter;
    }

    if (search) {
        findOptions.where = [
            { ...Filter, name: Like(`%${search}%`) },
            { ...Filter, email: Like(`%${search}%`) },
            { ...Filter, role: { ...roleFilter, role: Like(`%${search}%`) } }
        ];
    } else if (Object.keys(Filter).length > 0) {
        findOptions.where = Filter;
    }

    return await employeeRepository.find(findOptions);
};

// Get all departments
const findAllDepartments = async () => {
    return await departmentRepository.find();
};

// Get all roles
const findAllRoles = async () => {
    return await roleRepository.find();
};

// Find employee by ID with role relation
const findEmployeeById = async (id) => {
    return await employeeRepository.findOne({ where: { id }, relations: ["role"] });
};

// Create a new employee
const createEmployee = async ({ name, email,  department_id , role_name, salary, joining_date, status }) => {
    return await employeeRepository.save({
        name,
        email,
        department_id : parseInt(department_id),
        role_name,
        salary : parseInt(salary),
        joining_date,
        status
    });
};

// Update an existing employee
const updateEmployee = async ({ employeeId, name, email, role_id, joining_date, status }) => {
    const employee = await employeeRepository.findOne({ where: { id: employeeId }, relations: ["role"] });
    if (!employee) return null;

    employee.name = name;
    employee.email = email;
    employee.role = { id: parseInt(role_id) };
    employee.status = status;
    employee.joining_date = joining_date;

    return await employeeRepository.save(employee);
};

// Delete an employee by ID (leaves role untouched)
const deleteEmployeeById = async (id) => {
    const employee = await employeeRepository.findOne({ where: { id }, relations: ["role"] });
    if (!employee) return null;

    return await employeeRepository.remove(employee);
};

export default {
    findAllEmployees,
    findAllDepartments,
    findAllRoles,
    findEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployeeById
};
