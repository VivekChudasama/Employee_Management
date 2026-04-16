import employeeService from '../services/employeesService.js';
import { ResponseMessages } from '../config/response_messages.js'
import { Constants } from '../config/constants.js'

// Get list of employees with search support
const getEmployees = async (req, res, next) => {
    try {
        const queryParams = req.query;

        const employees = await employeeService.findAllEmployees(queryParams);

        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE)
            .json({ message: ResponseMessages.employee.EMPLOYEES_FETCHED, data: employees });
    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.employee.ERROR_FETCHING_EMPLOYEES , error: err.message });
    }
};

// Handle add employee form submission
const postAddEmployee = async (req, res, next) => {
    try {
        const employeeData = req.body;

        await employeeService.createEmployee(employeeData);

        res.status(Constants.RESPONSE_STATUS_CODE.CREATED_SUCCESS_CODE)
            .json({ message: ResponseMessages.employee.EMPLOYEE_CREATED });
    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.employee.ERROR_ADDING_EMPLOYEE , error: err.message });
    }
};

// Get employee detail by ID for editing
const getEmployeeDetailById = async (req, res, next) => {
    try {
        const empId = req.params.employeeId;

        const employee = await employeeService.findEmployeeById(empId);

        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE)
            .json({ message: ResponseMessages.employee.EMPLOYEE_FETCHED, data: employee });
    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.employee.ERROR_FETCHING_EMPLOYEE , error: err.message });
    }
};

// Handle edit employee submission
const editEmployeeDetails = async (req, res, next) => {
    try {
        const empId = req.params.employeeId;
        const updateData = req.body;

        await employeeService.updateEmployee(empId, updateData);

        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE)
            .json({ message: ResponseMessages.employee.EMPLOYEE_UPDATED });

    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.employee.ERROR_UPDATING_EMPLOYEE  , error: err.message });
    }
};

// Handle delete employee request
const deleteEmployee = async (req, res, next) => {
    try {
        const empId = req.params.employeeId;

        await employeeService.deleteEmployeeById(empId);

        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE)
            .json({ message: ResponseMessages.employee.EMPLOYEE_DELETED });

    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.employee.ERROR_DELETING_EMPLOYEE , error: err.message });
    }
};

export default {
    getEmployees,
    postAddEmployee,
    getEmployeeDetailById,
    editEmployeeDetails,
    deleteEmployee
};