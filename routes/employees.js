import express from 'express';

import Controller from '../controllers/employees.js';

const router = express.Router();

// //get list of employees
router.get('/', Controller.getEmployees);

// //add, edit, delete employee
// router.get('/add-employee', Controller.getAddEmployees);
// router.post('/add-employee', Controller.postAddEmployee);
// router.get('/edit-employee/:employeeId', Controller.getEditEmployee);
// router.post('/edit-employee', Controller.postEditEmployee);
// router.post('/delete-employee', Controller.postDeleteEmployee);

export default router;
