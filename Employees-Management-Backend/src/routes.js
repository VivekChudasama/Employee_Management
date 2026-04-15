import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import get404 from './services/errorService.js';

import employeeRoutes from './routes/employeesRoutes.js';
import roleRoutes from './routes/rolesRoutes.js';

const app = express();

app.use(cors());

// Middleware to parse request body 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use routes
app.use('/employees', employeeRoutes);
app.use('/roles', roleRoutes);

// 404 route
app.use(get404);

export default app; 