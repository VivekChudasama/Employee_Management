import { Like, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { roleRepository } from '../repositories/rolesRepository.js';
import { departmentRepository } from '../repositories/departmentRepository.js';
import { employeeRepository } from '../repositories/employeesRepository.js';

// Get all employees with search & filters
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

    // This method which return all the roles based on the filter applied on role and department
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
    return await departmentRepository.findDepartments();
};

// Get all roles
const findAllRoles = async () => {
    return await roleRepository.findAllRoles();
};

// Find employee by ID with role relation
const findEmployeeById = async (id) => {
    return await employeeRepository.findOneEmployeeById(id);
};

// Create a new employee
const createEmployee = async ({ name, email, role_id, joining_date, status }) => {
    return await employeeRepository.saveEmployee({
        name,
        email,
        role_id: parseInt(role_id),
        joining_date,
        status
    });
};

// Update an existing employee
const updateEmployee = async ({ employeeId, name, email, role_id, joining_date, status }) => {
    const employee = await employeeRepository.findOneEmployeeById(employeeId);
    if (!employee) return null;
 
    employee.name = name;
    employee.email = email;
    employee.role_id = parseInt(role_id);
    employee.status = status;
    employee.joining_date = joining_date;

    // Remove role relation during save and add updated role_id to employee.
    delete employee.role;

    return await employeeRepository.saveEmployee(employee);
};

// Delete an employee by ID
const deleteEmployeeById = async (id) => {
    const employee = await employeeRepository.findOneEmployeeById(id);
    if (!employee) return null;

    return await employeeRepository.removeEmployeeById(employee);
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
