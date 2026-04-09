import express from 'express';
import bodyParser from 'body-parser';
import get404 from './services/error.js';

import employeeRoutes from './routes/employees.js';
import roleRoutes from './routes/roles.js';

const app = express();

// Middleware to parse request body 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use routes
app.use('/employees', employeeRoutes);
app.use('/roles', roleRoutes);

// 404 route
app.use(get404);

export default app;