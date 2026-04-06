import roleSchema from '../models/roles.js';
import { AppDataSource } from '../util/database.js';

const roleRepository = AppDataSource.getRepository(roleSchema);


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

const getAddRole = (req, res, next) => {
    res.render('roles/add_role', {
        pageTitle: 'Add Role',
        path: '/add-role'
    });
};

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

const getEditRole = (req, res, next) => {
    const roleId = req.params.roleId;
    roleRepository.findBy({ id: roleId })
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

const editRole = (req, res, next) => {
    const roleId = req.params.roleId;
    const updatedRole = req.body.role || req.body.role_name;
    const updatedSalary = req.body.salary;
    const updatedDepartmentId = req.body.department_id;

    roleRepository.update({ id: roleId }, {
        role: updatedRole,
        salary: updatedSalary,
        department_id: updatedDepartmentId
    })
        .then(result => {
            console.log('Role updated');
            // res.redirect('/roles');
            res.send({ message: 'Role updated' });
        })
        .catch(err => console.log(err));
}

const deleteRole = (req, res, next) => {
    const roleId = req.params.roleId;

    roleRepository.delete({ id: roleId })

        .then(result => {
            console.log('Role deleted');
            // res.redirect('/roles');
            if (result.affected === 0) {
                return res.status(404).send({ message: 'Role-ID not found' });
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