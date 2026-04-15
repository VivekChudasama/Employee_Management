
import { body, query, validationResult, param } from 'express-validator';

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

export const getEmployeeByIdValidation = [
    param('employeeId').isInt().withMessage('Employee ID must be a valid integer').notEmpty().withMessage('Employee ID is required')
];

//Get Employee validation rules for query parameters
export const getEmployeeValidation = [
    query('search').optional().isString().withMessage('Search must be a string').trim(),

    query('status').optional().isIn(['active', 'inactive']).withMessage('Status must be either active or inactive'),

    query('department_id').optional().isInt().withMessage('Department ID must be a valid integer'),

    query('min_salary').optional().isNumeric().withMessage('Minimum salary must be a numeric value').isFloat({ min: 0 }).withMessage('Minimum salary cannot be negative'),

    query('max_salary').optional().isNumeric().withMessage('Maximum salary must be a numeric value'),
];

// Add Employee validation rules
export const addEmployeeValidation = [
    body('name').isString().withMessage('Name must be a string').isAlpha().withMessage('Name must contain only alphabetical characters')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3, max: 50 }).withMessage('Name is in between 3 to 50 character').trim(),

    body('email').isEmail().withMessage('Invalid email format').normalizeEmail().notEmpty().withMessage('Email is required').trim(),

    body('role_id').isInt().withMessage('Role ID must be a valid integer').notEmpty().withMessage('Role_id is required'),

    body('status').isIn(['active', 'inactive']).notEmpty().withMessage('Status must be either active or inactive'),

    body('joining_date').isISO8601().withMessage('Joining date must be a valid ISO8601 date')
        .notEmpty().withMessage('joining_date is required').isAfter('2026-01-01').withMessage('Joining date must be after January 1, 2026')
];

// update Employee validation rules                                                                                                                                                                                 
export const updateEmployessValidation = [
    param('employeeId').notEmpty().withMessage('Employee ID is required')
        .isInt().withMessage('Employee ID must be a valid integer'),

    body('name').optional().isString().withMessage('Name must be a string')
        .isAlpha().withMessage('Name must contain only alphabetical characters')
        .isLength({ min: 3, max: 50 }).withMessage('Name is in between 3 to 50 character').trim(),

    body('email').optional().isEmail().withMessage('Invalid email format').normalizeEmail().trim(),

    body('role_id').optional().isInt().withMessage('Role ID must be a valid integer'),

    body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be either active or inactive'),

    body('joining_date').optional().isISO8601().withMessage('Joining date must be a valid ISO8601 date')
        .isAfter('2026-01-01').withMessage('Joining date must be after January 1, 2026')
];

// Employee delete validation rules
export const deletEmployessValidation = [
    param('employeeId').notEmpty().withMessage('Employee ID is required')
        .isInt().withMessage('Employee ID must be a valid integer')
];