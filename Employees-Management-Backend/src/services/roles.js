import { roleRepository } from '../repositories/rolesRepository.js';
import { employeeRepository } from '../repositories/employeesRepository.js';
import { ResponseMessages } from '../config/response_messages.js'

// Get all roles
const findAllRoles = async () => {
    return await roleRepository.findAllRoles();
};

// Find role by ID
const findRoleById = async (id) => {
    const existingRole = await roleRepository.findRolesById(id);
    if (!existingRole) {
        throw new Error(ResponseMessages.role.ERROR_ROLE_ID);
    }
    return await roleRepository.findRolesById(id);
};

// Create a new role
const createRole = async ({ role, salary, department_id }) => {
    return await roleRepository.saveRole({
        role,
        salary,
        department_id
    });
};

// Update an existing role
const updateRole = async ({ roleId, updatedRole, updatedSalary, updatedDepartmentId }) => {
    const existingRole = await roleRepository.findRolesById(roleId);
    if (!existingRole) {
        throw new Error(ResponseMessages.role.ERROR_ROLE_ID);
    }

    existingRole.role = updatedRole;
    existingRole.salary = updatedSalary;
    existingRole.department_id = updatedDepartmentId;

    return await roleRepository.saveRole(existingRole);
};

// Delete a role (only if not assigned to any employee)
const deleteRoleById = async (roleId) => {
    const existingRole = await roleRepository.findRolesById(roleId);

    const employeesCount = await employeeRepository.countEmployeesByRoleId(roleId);

    if (!existingRole) {
        throw new Error(ResponseMessages.role.ERROR_ROLE_ID);
    }

    // If there are employees assigned to this role so we cannot delete the role
    if (employeesCount > 0) {
        throw new Error(ResponseMessages.role.ERROR_ROLE_ASSIGNED);
    }

    return await roleRepository.deleteRole(existingRole);
};

export default {
    findAllRoles,
    findRoleById,
    createRole,
    updateRole,
    deleteRoleById
};
