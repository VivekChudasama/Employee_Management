import roleService from '../services/roles.js';

// Get list of all roles
const getRoles = async (req, res, next) => {
    try {
        const roles = await roleService.findAllRoles();
        res.status(200).json(roles);
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error listing roles", error: err.message });
    }
};

// Handle add role form submission
const postAddRole = async (req, res, next) => {
    try {
        const { role, salary, department_id } = req.body;

        const result = await roleService.createRole({ role, salary, department_id });

        console.log('Role added');
        res.status(201).json({ message: 'Role added successfully' });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }
};

// Get role by ID for editing
const getEditRoleById = async (req, res, next) => {
    try {
        const roleId = req.params.roleId;

        const role = await roleService.findRoleById(roleId);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.status(200).json(role);
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error fetching role', error: err.message });
    }
};

// Handle edit role submission
const editRole = async (req, res, next) => {
    try {
        console.log('Edit role request body:', req.body);

        const { id, role, salary, department_id } = req.body;

        const result = await roleService.updateRole({ roleId: id, updatedRole: role, updatedSalary: salary, updatedDepartmentId: department_id });
        if (!result) return res.status(404).json({ message: 'Role not found' });

        console.log('Role updated successfully:', result);
        res.status(200).json({ message: 'Role updated', role: result });
    } catch (err) {
        console.log('Error updating role:', err);
        res.status(500).json({ message: err.message });
    }
};

// Handle delete role request
const deleteRole = async (req, res, next) => {
    try {
        const { id } = req.body;

        await roleService.deleteRoleById(id);

        console.log('Role deleted');
        res.status(200).json({ message: 'Role deleted' });
    } catch (err) {
        console.log('Error deleting role:', err);
        res.status(500).json({ message: err.message });
    }
};

export default {
    getRoles,
    postAddRole,
    getEditRoleById,
    editRole,
    deleteRole
};
