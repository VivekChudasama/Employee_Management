import express from 'express';
import Controller from '../controllers/roles.js';
import { roleValidationRules, validate } from '../schema/roleValidation.js';

const router = express.Router();

//get list of the roles
router.get('/', Controller.getRoles);

// add new role
router.post('/add-role', roleValidationRules, validate, Controller.postAddRole);

//edit role by id
router.get('/:roleId', Controller.getRoleDetailsById);
router.put('/', roleValidationRules, validate, Controller.editRole);

//delete role
router.delete('/delete-role/', Controller.deleteRole);

export default router;
