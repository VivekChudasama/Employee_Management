import roleSchema from '../models/roles.js';


const getRoles = (req, res, next) => {
    roleRepository.find()
        .then(roles => {
            res.render('roles/roles_list', {
                pageTitle: 'Roles',
                roles: roles,
                path: '/roles'
            });
        })
        .catch(err => console.log(err));
};

export default {
    getRoles
};