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

// Employee validation rules
export const employeeValidationRules = [
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().notEmpty().withMessage('Invalid email format'),
    body('role_id').isInt().notEmpty().withMessage('Role ID must be a valid integer'),
    body('status').isIn(['active', 'inactive']).notEmpty().withMessage('Status must be either active or inactive'),
    body('joining_date').notEmpty().isISO8601().withMessage('Joining date must be a valid ISO8601 date')
];
