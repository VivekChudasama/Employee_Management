import express from 'express';
import bodyParser from'body-parser';
import path from 'path';
import {dirname} from 'path';
import { fileURLToPath } from 'url';

import errorController from './controllers/error.js';
import employeeRoutes from './routes/employees.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/employees', employeeRoutes);


export default app;