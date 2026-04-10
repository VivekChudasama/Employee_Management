import { body, validationResult } from 'express-validator';

// Middleware to handle validation results
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
        });
    }
    next();
};

//Get Employee validation rules
export const getEmployeeValidation = [
    body('employeeId').isInt().withMessage('Employee ID must be a valid integer').notEmpty().withMessage('Employee ID is required')
];

// Add Employee validation rules
export const addEmployeeValidation = [
    body('name').isString().withMessage('Name must be a string').matches(/^[^0-9]*$/).withMessage('Name cannot contain numbers').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Invalid email format').notEmpty().withMessage('Email is required').trim(),
    body('role_id').isInt().withMessage('Role ID must be a valid integer').notEmpty().withMessage('Role_id is required'),
    body('salary').isNumeric().withMessage('Name must be a Numeric').notEmpty().withMessage('Salary is required'),
    body('status').isIn(['active', 'inactive']).notEmpty().withMessage('Status must be either active or inactive'),
    body('joining_date').isISO8601().withMessage('Joining date must be a valid ISO8601 date').notEmpty().withMessage('joining_date is required'),
];

// Employee update validation rules
export const updateEmployessValidation = [
    body('name').optional().isString().withMessage('Name must be a string').matches(/^[^0-9]*$/).withMessage('Name cannot contain numbers').trim(),
    body('email').optional().isEmail().withMessage('Invalid email format').trim(),
    body('role_id').optional().isInt().withMessage('Role ID must be a valid integer'),
    body('salary').optional().isNumeric().withMessage('Name must be a Numeric'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be either active or inactive'),
    body('joining_date').optional().isISO8601().withMessage('Joining date must be a valid ISO8601 date'),
];

// Employee delete validation rules
export const deletEemployessValidation= [
    body('id').isInt().withMessage('Employee ID must be a valid integer').notEmpty().withMessage('Employee ID is required')
];