import express from 'express';

import Controller from '../controllers/roles.js';

const router = express.Router();

//get list of the roles
router.get('/', Controller.getRoles);

//add new role
router.get('/add-role', Controller.getAddRole);
router.post('/add-role', Controller.postAddRole);

//edit and delete role by id
router.get('/:roleId', Controller.getEditRole);
router.put('/:roleId', Controller.editRole);
router.delete('/:roleId', Controller.deleteRole);

export default router;
