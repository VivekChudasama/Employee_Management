import express from 'express';

import Controller from '../controllers/employees.js';

const router = express.Router();

// //get list of employees
router.get('/', Controller.getEmployees);

// //add new employee
// router.get('/add-employee', Controller.getEmployeesDepartments);
router.post('/add-employee', Controller.postAddEmployee);

//edit and delete employee by id
router.get('/:employeeId', Controller.getEditEmployeeDetailById);
router.put('/', Controller.editEmployee);
router.delete('/delete-employee', Controller.deleteEmployee);

export default router;
 