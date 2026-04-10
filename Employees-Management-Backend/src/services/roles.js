import {roleRepository} from '../repositories/rolesRepository.js';
import {employeeRepository} from '../repositories/employeesRepository.js';

// Get all roles
const findAllRoles = async () => {
    return await roleRepository.findAllRoles();
};

// Find role by ID
const findRoleById = async (id) => {
    return await roleRepository.findRolesById(id);
};

// Create a new role
const createRole = async ({ role , salary , department_id }) => {
    if (!role) {
        throw new Error('Role name is required');
    }

    return await roleRepository.createRole({
        role,
        salary: parseInt(salary),
        department_id: parseInt(department_id)
    });
};

// Update an existing role
const updateRole = async ({ roleId, updatedRole, updatedSalary, updatedDepartmentId }) => {
    if (!roleId) {
        throw new Error('Role ID is required');
    }

    // Check if both the fields are provided and not empty
    if (!updatedRole || !updatedSalary || !updatedDepartmentId) {
        throw new Error('Role name, salary and department are required');
    }

    const existingRole = await roleRepository.findRolesById(roleId);
    if (!existingRole) return null;

    existingRole.role = updatedRole;
    existingRole.salary = parseInt(updatedSalary);
    existingRole.department_id = parseInt(updatedDepartmentId);

    return await roleRepository.saveRole(existingRole);
};

// Delete a role (only if not assigned to any employee)
const deleteRoleById = async (roleId) => {
    if (!roleId) {
        throw new Error('Role ID is required');
    }

    const existingRole = await roleRepository.findRolesById(roleId);
    if (!existingRole) {
        throw new Error('Role not found');
    }

    const employees = await employeeRepository.findEmployeeRole({ where: { role_id: parseInt(roleId) } });

    // If there are employees assigned to this role so we cannot delete the role
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
