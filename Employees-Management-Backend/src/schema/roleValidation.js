import { body, validationResult } from 'express-validator';

// Middleware to handle validation results
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: "Validation failed", 
            errors: errors.array().map(err =>({ field: err.param, message: err.msg }))
        });
    }
    next();
};

//Add Role validation rules
export const addRoleValidation = [
    body('role').isString().withMessage('Role must be a string').notEmpty().withMessage('Role is required').matches(/^[^0-9]*$/).withMessage('Role cannot contain numbers').trim(),
    body('salary').isNumeric().withMessage('Salary must be a numeric value').notEmpty().withMessage('Salary is required'),
    body('department_id').isInt().withMessage('Department ID must be a valid integer').notEmpty().withMessage('department_id is required')
];

export const updateRoleValidation = [
    body('role').optional().isString().withMessage('Role must be a string').matches(/^[^0-9]*$/).withMessage('Role cannot contain numbers').trim(),
    body('salary').optional().isNumeric().withMessage('Salary must be a numeric value'),
    body('department_id').optional().isInt().withMessage('Department ID must be a valid integer')
];

export const deleteRoleValidation = [
    body('id').isInt().withMessage('Role ID must be a valid integer').notEmpty().withMessage('Role ID is required')
];