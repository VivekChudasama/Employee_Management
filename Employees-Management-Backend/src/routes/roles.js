import express from 'express';
import Controller from '../controllers/roles.js';
import { getRoleByIdValidation, addRoleValidation, updateRoleValidation , deleteRoleValidation ,  validate } from '../schema/roleValidation.js';

const router = express.Router();

//get list of the roles
router.get('/', Controller.getRoles);

// add new role
router.post('/add-role', addRoleValidation, validate, Controller.postAddRole);

//edit/update role details by id
router.get('/:roleId', getRoleByIdValidation, validate, Controller.getRoleDetailsById);
router.put('/:roleId', updateRoleValidation, validate, Controller.editRoleDetails);

//delete role by id
router.delete('/:roleId', deleteRoleValidation , validate ,  Controller.deleteRole);

export default router;
