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

        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE)
            .json({ message: ResponseMessages.employee.EMPLOYEES_FETCHED });
    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.employee.ERROR_FETCHING_EMPLOYEES });
    }
};

// Handle add employee form submission
const postAddEmployee = async (req, res, next) => {
    try {
        const { name, email, role_id, joining_date, status } = req.body;

        await employeeService.createEmployee(
            { name, email, role_id, joining_date, status }
        );

        res.status(Constants.RESPONSE_STATUS_CODE.CREATED_SUCCESS_CODE)
            .json({ message: ResponseMessages.employee.EMPLOYEE_CREATED });
    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.employee.ERROR_ADDING_EMPLOYEE, error: err.message });
    }
};

// Get employee detail by ID for editing
const getEmployeeDetailById = async (req, res, next) => {
    try {
        const empId = req.params.employeeId;

        const existingEmployee = await employeeService.findEmployeeById(empId);
        if (!existingEmployee) {
            return res.status(Constants.RESPONSE_STATUS_CODE.NOT_FOUND_CODE)
                .json({ message: ResponseMessages.employee.ERROR_EMPLOYEE_ID });
        }

        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE)
            .json({ message: ResponseMessages.employee.EMPLOYEE_FETCHED, employee: existingEmployee });
    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.employee.ERROR_FETCHING_EMPLOYEE, error: err.message });
    }
};

// Handle edit employee submission
const editEmployeeDetails = async (req, res, next) => {
    try {
        const empId = req.params.employeeId;
        const { name, email, role_id, joining_date, status } = req.body;

        const existingEmployee = await employeeService.findEmployeeById(empId);

        if (!existingEmployee) {
            return res.status(Constants.RESPONSE_STATUS_CODE.NOT_FOUND_CODE)
                .json({ message: ResponseMessages.employee.ERROR_EMPLOYEE_ID });
        }

        const updated = await employeeService.updateEmployee(
            { employeeId: empId, updatedName : name, updatedEmail : email, updatedRole_id : role_id, updatedJoining_date :  joining_date, updatedStatus : status }
        );

        if (updated) return res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE)
            .json({ message: ResponseMessages.employee.EMPLOYEE_UPDATED });

    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.employee.ERROR_UPDATING_EMPLOYEE, error: err.message });
    }
};

// Handle delete employee request
const deleteEmployee = async (req, res, next) => {
    try {
        const empId = req.params.employeeId;

        const existingEmployee = await employeeService.findEmployeeById(empId);

        if (!existingEmployee) {
            return res.status(Constants.RESPONSE_STATUS_CODE.NOT_FOUND_CODE)
                .json({ message: ResponseMessages.employee.ERROR_EMPLOYEE_ID });
        }

        await employeeService.deleteEmployeeById(empId);

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
    editEmployeeDetails,
    deleteEmployee
};