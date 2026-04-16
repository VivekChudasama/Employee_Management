
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

//Get Employee validation rules for query parameters
export const getEmployeeValidation = [
    query('search').optional().isString().withMessage('Search must be a string').trim(),

    query('status').optional().isIn(['active', 'inactive']).withMessage('Status must be either active or inactive'),

    query('department_id').optional().isInt().withMessage('Department ID must be a valid integer'),

    query('min_salary').optional().isNumeric().withMessage('Minimum salary must be a numeric value')
        .isFloat({ min: 0 }).withMessage('Minimum salary cannot be negative'),

    query('max_salary').optional().isNumeric().withMessage('Maximum salary must be a numeric value'),
];

// Get Employee by ID validation rules
export const getEmployeeByIdValidation = [
    param('employeeId').isInt().withMessage('Employee ID must be a valid integer').notEmpty().withMessage('Employee ID is required')
];



// Add Employee validation rules
export const addEmployeeValidation = [
    body('name').trim().notEmpty().withMessage('Name is required')
        .bail()
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3 and 50 characters')
        .matches(/^[a-zA-Z\s.]+$/).withMessage('Name can only contain letters, spaces, and dots'),

    body('email').trim().notEmpty().withMessage('Email address is required')
        .bail()
        .isEmail().withMessage('Invalid email format')
        .isLength({ max: 254 }).withMessage('Email must be less than 254 characters')
        .normalizeEmail(),

    body('role_id').trim().notEmpty().withMessage('Role ID is required')
        .bail()
        .isInt({ min: 1 }).withMessage('Role ID must be a valid positive integer'),

    body('status').trim().notEmpty().withMessage('Status is required')
        .bail()
        .isIn(['active', 'inactive']).withMessage('Status must be either active or inactive'),

    body('joining_date').trim().notEmpty().withMessage('Joining date is required')
        .bail()
        .isISO8601().withMessage('Joining date must be a valid ISO8601 date')
        .isAfter('2026-01-01').withMessage('Joining date cannot be before year 2026')

];

// update Employee validation rules                                                                                                                                                                                 
export const updateEmployessValidation = [
    param('employeeId').isInt({ min: 1 }).withMessage('Employee ID must be a valid positive integer'),

    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty')
        .bail()
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3 and 50 characters')
        .matches(/^[a-zA-Z\s.]+$/).withMessage('Name can only contain letters, spaces, and dots'),

    body('email').optional().trim().notEmpty().withMessage('Email cannot be empty')
        .bail()
        .isLength({ max: 254 }).withMessage('Email must be less than 254 characters')
        .isEmail().withMessage('Invalid email format').normalizeEmail(),

    body('role_id').optional().trim().notEmpty().withMessage('Role ID cannot be empty')
        .bail()
        .isInt({ min: 1 }).withMessage('Role ID must be a valid positive integer'),

    body('status').optional().trim().notEmpty().withMessage('Status cannot be empty')
        .bail()
        .isIn(['active', 'inactive']).withMessage('Status must be either active or inactive'),

    body('joining_date').optional().trim().notEmpty().withMessage('Joining date cannot be empty')
        .bail()
        .isISO8601().withMessage('Joining date must be a valid ISO8601 date')
        .isAfter('2026-01-01').withMessage('Joining date cannot be before year 2026')
];

// Employee delete validation rules
export const deletEmployessValidation = [
    param('employeeId').notEmpty().withMessage('Employee ID is required')
        .isInt().withMessage('Employee ID must be a valid integer')
];