import express from 'express';
import Controller from '../controllers/employees.js';
import {getEmployeeByIdValidation, getEmployeeValidation, addEmployeeValidation, updateEmployessValidation, deletEmployessValidation ,  validate } from '../schema/employeeValidation.js';

const router = express.Router();

//get list of employees
router.get('/', getEmployeeValidation, validate , Controller.getEmployees);

// add new employee
router.post('/add-employee', addEmployeeValidation, validate, Controller.postAddEmployee);

//edit/update employee details
router.get('/:employeeId', getEmployeeByIdValidation, validate, Controller.getEmployeeDetailById);
router.put('/:employeeId', updateEmployessValidation, validate, Controller.editEmployeeDetails);

//delete employee by id
router.delete('/:employeeId', deletEmployessValidation , validate, Controller.deleteEmployee);

export default router;
 