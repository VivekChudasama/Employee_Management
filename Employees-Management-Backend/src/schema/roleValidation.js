import { body, validationResult, param } from 'express-validator';

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

export const getRoleByIdValidation = [
    param('roleId').isInt().withMessage('Role ID must be a valid integer').notEmpty().withMessage('Role ID is required')
];

// Add Role validation rules
export const addRoleValidation = [
    body('role').trim().notEmpty().withMessage('Role name is required')
        .bail()
        .isString().withMessage('Role must be a string')
        .isLength({ min: 3, max: 30 }).withMessage('Role name must be between 3 and 30 characters'),

    body('salary').trim().notEmpty().withMessage('Salary is required')
        .bail()
        .isNumeric().withMessage('Salary must be a numeric value')
        .isFloat({ min: 1 }).withMessage('Salary must be a positive value higher than zero'),

    body('department_id').trim().notEmpty().withMessage('Department ID is required')
        .bail()
        .isInt({ min: 1 }).withMessage('Department ID must be a valid positive integer')
];

// Update Role validation rules
export const updateRoleValidation = [
    param('roleId').isInt({ min: 1 }).withMessage('Role ID must be a valid positive integer'),

    body('role').optional().trim().notEmpty().withMessage('Role name cannot be empty').bail()
        .isString().withMessage('Role must be a string')
        .isLength({ min: 3, max: 30 }).withMessage('Role name must be between 3 and 30 characters'),

    body('salary').optional().trim().notEmpty().withMessage('Salary cannot be empty').bail()
        .isNumeric().withMessage('Salary must be a numeric value')
        .isFloat({ min: 1 }).withMessage('Salary must be a positive value higher than zero'),

    body('department_id').optional().trim().notEmpty().withMessage('Department ID cannot be empty').bail()
        .isInt({ min: 1 }).withMessage('Department ID must be a valid positive integer')
];

// Delete Role validation rules
export const deleteRoleValidation = [
    param('roleId').isInt().withMessage('Role ID must be a valid integer').notEmpty().withMessage('Role ID is required')
];