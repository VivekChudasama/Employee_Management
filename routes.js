const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { employees, department, roles } = require('./models/relation');

const errorController = require('./controllers/error');
const employeeRoutes = require('./routes/employees');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/employees', employeeRoutes);

app.use(errorController.get404);
module.exports = app;