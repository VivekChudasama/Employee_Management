const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { employees, department, roles } = require('./models/relation');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(employees , department , roles);

const employeeRoutes = require('./routes/employees');
const e = require('express');

app.use('/employees', employeeRoutes);

module.exports = app;