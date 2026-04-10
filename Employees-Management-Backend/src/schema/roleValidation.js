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

//Add Role validation rules
export const addRoleValidation = [
    body('role').isString().withMessage('Role must be a string').notEmpty().withMessage('Role is required')
        .isLength({ min: 3, max: 30 }).withMessage('Name is in between 3 to 30 character').trim(),

    body('salary').isNumeric().withMessage('Salary must be a numeric value').notEmpty().withMessage('Salary is required'),

    body('department_id').isInt().withMessage('Department ID must be a valid integer').notEmpty().withMessage('department_id is required')
];

export const updateRoleValidation = [
    body('role').optional().isString().withMessage('Role must be a string')
        .isLength({ min: 3, max: 30 }).withMessage('Name is in between 3 to 30 character').trim(),

    body('salary').optional().isNumeric().withMessage('Salary must be a numeric value'),

    body('department_id').optional().isInt().withMessage('Department ID must be a valid integer')
];

export const deleteRoleValidation = [
    body('id').isInt().withMessage('Role ID must be a valid integer').notEmpty().withMessage('Role ID is required')
];