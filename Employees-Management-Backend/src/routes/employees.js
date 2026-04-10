import express from 'express';
import Controller from '../controllers/employees.js';
import { addEmployeeValidation, updateEmployessValidation, deletEemployessValidation ,  validate } from '../schema/employeeValidation.js';

const router = express.Router();

//get list of employees
router.get('/', Controller.getEmployees);

// add new employee
router.post('/add-employee', addEmployeeValidation, validate, Controller.postAddEmployee);

//edit/update employee by id
router.get('/:employeeId', Controller.getEmployeeDetailById);
router.put('/', updateEmployessValidation, validate, Controller.editEmployeeDetails);

//delete employee
router.delete('/delete-employee', deletEemployessValidation , validate, Controller.deleteEmployee);

export default router;
 