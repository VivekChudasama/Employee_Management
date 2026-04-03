import express from 'express';

import Controller from '../controllers/roles.js';

const router = express.Router();

//get list of the roles
router.get('/', Controller.getRoles);

//add, edit, delete role
// router.get('/add-role', Controller.getAddRole);
// router.post('/add-role', Controller.postAddRole);
// router.get('/edit-role/:roleId', Controller.getEditRole);
// router.put('/edit-role/:roleId', Controller.postEditRole);
// router.post('/delete-role/:roleId', Controller.postDeleteRole);

export default router;
