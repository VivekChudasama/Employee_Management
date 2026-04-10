import express from 'express';
import Controller from '../controllers/employees.js';
import { employeeValidationRules, validate } from '../schema/employeeValidation.js';

const router = express.Router();

// //get list of employees
router.get('/', Controller.getEmployees);

// add new employee
router.post('/add-employee', employeeValidationRules, validate, Controller.postAddEmployee);

//edit employee by id
router.get('/:employeeId', Controller.getEmployeeDetailById);
router.put('/', employeeValidationRules, validate, Controller.editEmployee);

//delete employee
router.delete('/delete-employee', Controller.deleteEmployee);

export default router;
 