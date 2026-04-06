import express from 'express';
import bodyParser from'body-parser';
import path from 'path';
import {dirname} from 'path';
import { fileURLToPath } from 'url';

import employeeRoutes from './routes/employees.js';
import roleRoutes from './routes/roles.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/employees', employeeRoutes);
app.use('/roles', roleRoutes);

export default app;