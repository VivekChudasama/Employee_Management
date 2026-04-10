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

// Role validation rules
export const roleValidationRules = [
    body('role').trim().notEmpty().withMessage('Role name is required'),
    body('salary').isNumeric().withMessage('Salary must be a numeric value'),
    body('department_id').isInt().withMessage('Department ID must be a valid integer')
];

