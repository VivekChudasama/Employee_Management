import express from 'express';
import Controller from '../controllers/employees.js';
import {getEmployeeValidation, addEmployeeValidation, updateEmployessValidation, deletEmployessValidation ,  validate } from '../schema/employeeValidation.js';

const router = express.Router();

//get list of employees
router.get('/', getEmployeeValidation, validate , Controller.getEmployees);

// add new employee
router.post('/add-employee', addEmployeeValidation, validate, Controller.postAddEmployee);

//edit/update employee by id
router.get('/:employeeId', Controller.getEmployeeDetailById);
router.put('/', updateEmployessValidation, validate, Controller.editEmployeeDetails);

//delete employee
router.delete('/delete-employee', deletEmployessValidation , validate, Controller.deleteEmployee);

export default router;
 