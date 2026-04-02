const path = require('path');

const express = require('express');

const Controller = require('../controllers/employees');

const router = express.Router();

//get list of employees
router.get('/employees', Controller.getEmployees);

// //add, edit, delete employee
// router.get('/add-employee', Controller.getAddEmployees);
// router.post('/add-employee', Controller.postAddEmployee);
// router.get('/edit-employee/:employeeId', Controller.getEditEmployee);
// router.post('/edit-employee', Controller.postEditEmployee);
// router.post('/delete-employee', Controller.postDeleteEmployee);

module.exports = router;
