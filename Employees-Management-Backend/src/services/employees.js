import { Like, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { employeeRepository } from '../repositories/employeesRepository.js';
import { ResponseMessages } from '../config/response_messages.js'

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
        roleFilter.department_id = department_id;
    }

    if (min_salary && max_salary) {
        roleFilter.salary = Between((min_salary), (max_salary));
    } else if (min_salary) {
        roleFilter.salary = MoreThanOrEqual(min_salary);
    } else if (max_salary) {
        roleFilter.salary = LessThanOrEqual(max_salary);
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

// Find employee by ID with role relation
const findEmployeeById = async (id) => {
    const existingEmployee = await employeeRepository.findOneEmployeeById(id);
    if (!existingEmployee) {
        throw new Error(ResponseMessages.employee.ERROR_EMPLOYEE_ID);
    }

    return await employeeRepository.findOneEmployeeById(id);
};

// Create a new employee
const createEmployee = async ({ name, email, role_id, joining_date, status }) => {
    return await employeeRepository.saveEmployee({
        name,
        email,
        role_id,
        joining_date,
        status
    });
};

// Update an existing employee
const updateEmployee = async ({ employeeId, updatedName, updatedEmail, updatedRole_id, updatedStatus, updatedJoining_date }) => {
    const existingEmployee = await employeeRepository.findOneEmployeeById(employeeId);
    if (!existingEmployee) {
        throw new Error(ResponseMessages.employee.ERROR_EMPLOYEE_ID );
    };

    existingEmployee.name = updatedName;
    existingEmployee.email = updatedEmail;
    existingEmployee.role_id = updatedRole_id;
    existingEmployee.status = updatedStatus;
    existingEmployee.joining_date = updatedJoining_date;

    // Remove role relation during save and add updated role_id to employee.
    delete existingEmployee.role;

    return await employeeRepository.saveEmployee(existingEmployee);
};

// Delete an employee by ID
const deleteEmployeeById = async (employeeId) => {
    const existingEmployee = await employeeRepository.findOneEmployeeById(employeeId);

    if (!existingEmployee) {
        throw new Error(ResponseMessages.employee.ERROR_EMPLOYEE_ID);
    }

    return await employeeRepository.removeEmployeeById(existingEmployee);
};

export default {
    findAllEmployees,
    findEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployeeById
};
