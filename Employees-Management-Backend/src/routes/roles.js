import express from 'express';
import Controller from '../controllers/roles.js';
import { addRoleValidation, updateRoleValidation , deleteRoleValidation ,  validate } from '../schema/roleValidation.js';

const router = express.Router();

//get list of the roles
router.get('/', Controller.getRoles);

// add new role
router.post('/add-role', addRoleValidation, validate, Controller.postAddRole);

//edit/update role
router.get('/:roleId', Controller.getRoleDetailsById);
router.put('/', updateRoleValidation, validate, Controller.editRoleDetails);

//delete role
router.delete('/delete-role', deleteRoleValidation , validate ,  Controller.deleteRole);

export default router;
