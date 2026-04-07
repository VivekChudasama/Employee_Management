import express from 'express';

import Controller from '../controllers/employees.js';

const router = express.Router();

// //get list of employees
router.get('/', Controller.getEmployees);

// //add new employee
router.get('/add-employee', Controller.getAddEmployees);
router.post('/add-employee', Controller.postAddEmployee);

//edit and delete employee by id
router.get('/edit-employee/:employeeId', Controller.getEditEmployee);
router.put('/edit-employee', Controller.editEmployee);
router.post('/delete-employee', Controller.deleteEmployee);

export default router;
 