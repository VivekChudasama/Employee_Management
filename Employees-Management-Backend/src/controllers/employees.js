import employeeService from '../services/employees.js';
import { ResponseMessages } from '../config/response_messages.js'
import { Constants } from '../config/constants.js'

// Get list of employees with search support
const getEmployees = async (req, res, next) => {
    try {
        const { search, ajax, department_id, status, min_salary, max_salary } = req.query;

        const employees = await employeeService.findAllEmployees(
            { search, department_id, status, min_salary, max_salary }
        );

        if (ajax) {
            return res.json(employees);
        }

        const departments = await employeeService.findAllDepartments();
        const roles = await employeeService.findAllRoles();

        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE).json({ employees, departments, roles });
    } catch (err) {
        console.log(err);
        if (req.query.ajax)
            return res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
                .json({ error: ResponseMessages.employee.ERROR_FETCHING_EMPLOYEES });
        next(err);
    }
};

// Handle add employee form submission
const postAddEmployee = async (req, res, next) => {
    try {
        const { name, email, role_id, joining_date, status } = req.body;

        const employee = await employeeService.createEmployee(
            { name, email, role_id, joining_date, status }
        );

        res.status(Constants.RESPONSE_STATUS_CODE.CREATED_SUCCESS_CODE)
            .json({ message: ResponseMessages.employee.EMPLOYEE_CREATED });
    } catch (err) {
        console.log(err)
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.employee.ERROR_ADDING_EMPLOYEE, error: err.message });
    }
};

// Get employee detail by ID for editing
const getEmployeeDetailById = async (req, res, next) => {
    try {
        const empId = req.params.employeeId;

        const employee = await employeeService.findEmployeeById(empId);
        if (!employee) {
            return res.status(Constants.RESPONSE_STATUS_CODE.NOT_FOUND_CODE)
                .json({ message: ResponseMessages.employee.ERROR_EMPLOYEE_ID });
        }

        const departments = await employeeService.findAllDepartments();
        const roles = await employeeService.findAllRoles();

        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE)
            .json({ employee, departments, roles });
    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.employee.ERROR_FETCHING_EMPLOYEE, error: err.message });
    }
};

// Handle edit employee form submission
const editEmployee = async (req, res, next) => {
    try {
        const { employeeId, name, email, role_id, joining_date, status } = req.body;

        const updated = await employeeService.updateEmployee(
            { employeeId, name, email, role_id, joining_date, status }
        );
        if (!updated) return res.status(Constants.RESPONSE_STATUS_CODE.NOT_FOUND_CODE)
            .json({ message: ResponseMessages.employee.ERROR_EMPLOYEE_ID });

        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE)
            .json({ message: ResponseMessages.employee.EMPLOYEE_UPDATED, employee: updated });
    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.employee.ERROR_UPDATING_EMPLOYEE, error: err.message });
    }
};

// Handle delete employee request
const deleteEmployee = async (req, res, next) => {
    try {
        const empId = req.body.employeeId;

        const deleted = await employeeService.deleteEmployeeById(empId);
        if (!deleted) return res.status(Constants.RESPONSE_STATUS_CODE.NOT_FOUND_CODE)
            .json({ message: ResponseMessages.employee.ERROR_EMPLOYEE_ID });

        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE)
            .json({ message: ResponseMessages.employee.EMPLOYEE_DELETED });
    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.employee.ERROR_DELETING_EMPLOYEE, error: err.message });
    }
};

export default {
    getEmployees,
    postAddEmployee,
    getEmployeeDetailById,
    editEmployee,
    deleteEmployee
};