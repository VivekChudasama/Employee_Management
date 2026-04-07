import roleSchema from '../models/roles.js';
import { AppDataSource } from '../util/database.js';
import employees from './employees.js';

const roleRepository = AppDataSource.getRepository(roleSchema);

//get list of the roles
const getRoles = (req, res, next) => {
    roleRepository.find()
        .then(roles => {
            // res.render('roles/roles_list', {
            //     pageTitle: 'Roles',
            //     roles: roles,
            //     path: '/roles'
            // });
            res.send(roles);
        })
        .catch(err => console.log(err));
};

// Render add role form
const getAddRole = (req, res, next) => {
    // res.render('roles/add_role', {
    //     pageTitle: 'Add Role',
    //     path: '/add-role'
    // });
    res.status(200).send({ message: 'Render add role form' });
};

// Handle add role form submission
const postAddRole = (req, res, next) => {
    const role = req.body.role || req.body.role_name;
    const salary = req.body.salary;
    const department_id = req.body.department_id;

    if (!role) {
        return res.status(400).send({ message: "Role name is required" });
    }

    roleRepository.insert({
        role: role,
        salary: salary,
        department_id: department_id
    })
        .then((result) => {
            console.log('Role added');
            res.redirect('/roles');
        })
        .catch(err => console.log(err));
};

// Render edit role form with role data for given role ID
const getEditRole = (req, res, next) => {
    const roleId = req.params.roleId;
    roleRepository.findOneBy({ id: roleId })
        .then(role => {
            if (!role) {
                return res.redirect('/roles');
            }
            // res.render('roles/edit_role', {
            //     pageTitle: 'Edit Role',
            //     role: role,
            //     path: '/edit-role'
            // });
            res.send(role);
        })
        .catch(err => console.log(err));
};

// Handle edit role form submission
const editRole = (req, res, next) => {
    const roleId = req.params.roleId;
    const updatedRole = req.body.role || req.body.role_name;
    const updatedSalary = req.body.salary;
    const updatedDepartmentId = req.body.department_id;

    let updateData = {};
    if (updatedRole) updateData.role = updatedRole;
    if (updatedSalary) updateData.salary = updatedSalary;
    if (updatedDepartmentId) updateData.department_id = updatedDepartmentId;

    if (Object.keys(updateData).length === 0) {
        return res.send({ message: 'No data to update' });
    }

    roleRepository.update({ id: roleId }, updateData)
        .then(result => {
            console.log('Role updated');
            // res.redirect('/roles');
            res.send({ message: 'Role updated' });
        })
        .catch(err => console.log(err));
}

// Handle delete role request
const deleteRole = (req, res, next) => {
    const roleId = req.body.roleId;

    // roleRepository.find(roleId)
    //     .then(employees => {
    //         if (employees.roleId != roleId) {
    //             return res.status(400).send({ message: 'Cannot delete role as it is assigned to employees' });
    //         }

            roleRepository.delete({ id: roleId })
        // })

        .then(result => {
            console.log('Role deleted');
            // res.redirect('/roles');
            if (!roleId) {
                return res.status(404).send({ message: 'Role ID not found' });
            }
            res.send({ message: 'Role deleted' });
        })
        .catch(err => console.log(err));
};


export default {
    getRoles,
    getAddRole,
    postAddRole,
    getEditRole,
    editRole,
    deleteRole
};
