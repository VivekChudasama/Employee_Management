import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import get404 from './services/error.js';

import employeeRoutes from './routes/employees.js';
import roleRoutes from './routes/roles.js';

const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware to parse request body 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//to access public folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/employees', employeeRoutes);
app.use('/roles', roleRoutes);

// 404 route
app.use(get404);

export default app;