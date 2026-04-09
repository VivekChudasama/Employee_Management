import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cors from 'cors';

import get404 from './services/error.js';

import employeeRoutes from './routes/employees.js';
import roleRoutes from './routes/roles.js';

const app = express();

app.use(cors());

// Middleware to parse request body 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Method override for PUT and DELETE for HTML forms
app.use(methodOverride('_method'));

// Use routes
app.use('/employees', employeeRoutes);
app.use('/roles', roleRoutes);

// 404 route
app.use(get404);

export default app;