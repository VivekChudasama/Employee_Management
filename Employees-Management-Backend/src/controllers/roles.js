import roleService from '../services/roles.js';

// Get list of all roles
const getRoles = async (req, res, next) => {
    try {
        const roles = await roleService.findAllRoles();
        res.send(roles);
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Error listing roles", error: err.message });
    }
};

// // Render add role form
// const getAddRole = (req, res, next) => {
//     try {
//         res.status(200).send({ message: 'Render add role form' });
//     } catch (err) {
//         res.status(500).send({ message: 'Error rendering add role form', error: err.message });
//     }
// };

// Handle add role form submission
const postAddRole = async (req, res, next) => {
    try {
        const { role, salary, department_id } = req.body;

        await roleService.createRole({ role, salary, department_id });

        console.log('Role added');
        res.redirect('/roles');
    } catch (err) {
        console.log(err)
        res.status('Role name is required', 500)
            .send({ message: err.message });
    }
};

// Render edit role form with role data
const getEditRoleById = async (req, res, next) => {
    try {
        const roleId = req.params.roleId;

        const role = await roleService.findRoleById(roleId);
        if (!role) {
            return res.redirect('/roles');
        }

        res.send(role);
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Error fetching role', error: err.message });
    }
};

// Handle edit role form submission
const editRole = async (req, res, next) => {
    try {
        console.log('Edit role request body:', req.body);

        const { roleId, updatedRole, updatedSalary, updatedDepartmentId } = req.body;

        const result = await roleService.updateRole({ roleId, updatedRole, updatedSalary, updatedDepartmentId });
        if (!result) return res.status(404).send({ message: 'Role not found' });

        console.log('Role updated successfully:', result);
        res.send({ message: 'Role updated', role: result });
    } catch (err) {
        console.log('Error updating role:', err);
        const status = err.message === 'Role ID is required' ? 400 : 500;
        res.status(status).send({ message: err.message });
    }
};

// Handle delete role request
const deleteRole = async (req, res, next) => {
    try {
        const { roleId } = req.body;

        await roleService.deleteRoleById(roleId);

        console.log('Role deleted');
        res.send({ message: 'Role deleted' });
    } catch (err) {
        console.log('Error deleting role:', err);
        const status = err.message.includes('assigned to employees') ? 400
            : err.message === 'Role ID is required' ? 400 : 500;
        res.status(status).send({ message: err.message });
    }
};

export default {
    getRoles,
    // getAddRole,
    postAddRole,
    getEditRoleById,
    editRole,
    deleteRole
};
