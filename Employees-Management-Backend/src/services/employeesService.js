import { Like, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { employeeRepository } from '../repositories/employeesRepository.js';
import { ResponseMessages } from '../config/response_messages.js'
import { roleRepository } from "../repositories/rolesRepository.js";

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

    return await employeeRepository.findEmployees(findOptions);
};

// Find employee by ID with role relation
const findEmployeeById = async (id) => {
    const existingEmployee = await employeeRepository.findOneEmployeeById(id);
    //check if employee exists
    if (!existingEmployee) {
        throw new Error(ResponseMessages.employee.ERROR_EMPLOYEE_ID);
    }

    return existingEmployee;
};

// Create a new employee
const createEmployee = async (employeeData) => {
    const emailExist = await employeeRepository.findEmployeeByEmail(employeeData.email);
    // if email already exists for another employee
    if (emailExist) {
        throw new Error(ResponseMessages.employee.ERROR_EMPLOYEES_EMAIL_EXISTS);
    }

    // verify role exists before saving
    if (employeeData.role_id) {
        const roleExist = await roleRepository.findRolesById(employeeData.role_id);
        if (!roleExist) {
            throw new Error(ResponseMessages.role.ERROR_ROLE_ID);
        }
    }

    return await employeeRepository.saveEmployee(employeeData);
};

// Update an existing employee
const updateEmployee = async (employeeId, updateData) => {
    const existingEmployee = await employeeRepository.findOneEmployeeById(employeeId);

    //check if employee exists
    if (!existingEmployee) {
        throw new Error(ResponseMessages.employee.ERROR_EMPLOYEE_ID);
    }

    // If role_id is being updated.
    if (updateData.role_id) {
        const roleExist = await roleRepository.findRolesById(updateData.role_id);
        //check if role exists for the given role id
        if (!roleExist) {
            throw new Error(ResponseMessages.role.ERROR_ROLE_ID);
        }
    }

    //check if email already exists for other employee
    if (updateData.email && updateData.email !== existingEmployee.email) {
        const emailExist = await employeeRepository.findEmployeeByEmail(updateData.email);
        if (emailExist && emailExist.id !== existingEmployee.id) {
            throw new Error(ResponseMessages.employee.ERROR_EMPLOYEES_EMAIL_EXISTS);
        }
    }

    // Prevent changing the primary key from the request body
    delete updateData.id;

    // delete role relation and update it separately to avoid issues with TypeORM's relation handling during update.
    delete existingEmployee.role;

    return await employeeRepository.updateEmployee(existingEmployee , updateData);
};

// Delete an employee by ID
const deleteEmployeeById = async (employeeId) => {
    const existingEmployee = await employeeRepository.findOneEmployeeById(employeeId);

    //check if employee exists
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
