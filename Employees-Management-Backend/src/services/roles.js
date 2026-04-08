import roleRepository from '../repositories/rolesRepository.js';
import employeeRepository from '../repositories/rolesRepository.js';

// Get all roles
const findAllRoles = async () => {
    return await roleRepository.findAllRoles();
};

// Find role by ID
const findRoleById = async (id) => {
    return await roleRepository.findOneRoleById({ id: parseInt(id) });
};

// Create a new role
const createRole = async ({ role, salary, department_id }) => {
    if (!role) {
        throw new Error('Role name is required');
    }

    return await roleRepository.createRole({
        role,
        salary,
        department_id
    });
};

// Update an existing role
const updateRole = async ({ roleId, updatedRole, updatedSalary, updatedDepartmentId }) => {
    if (!roleId) {
        throw new Error('Role ID is required');
    }

    const existingRole = await roleRepository.findOneRoleById({ id: parseInt(roleId) });
    if (!existingRole) return null;

    if (updatedRole) existingRole.role = updatedRole;
    if (updatedSalary) existingRole.salary = parseInt(updatedSalary);
    if (updatedDepartmentId) existingRole.department_id = parseInt(updatedDepartmentId);

    return await roleRepository.saveRole(existingRole);
};

// Delete a role (only if not assigned to any employee)
const deleteRoleById = async (roleId) => {
    if (!roleId) {
        throw new Error('Role ID is required');
    }

    const employees = await employeeRepository.findEmployeeRole({ where: { role_id: roleId } });

    if (employees && employees.length > 0) {
        throw new Error('Cannot delete role as it is assigned to employees');
    }

    return await roleRepository.deleteRole({ id: parseInt(roleId) });
};

export default {
    findAllRoles,
    findRoleById,
    createRole,
    updateRole,
    deleteRoleById
};
