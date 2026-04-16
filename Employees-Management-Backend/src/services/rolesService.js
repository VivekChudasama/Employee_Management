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
    return existingRole;
};

// Create a new role
const createRole = async ({ role, salary, department_id }) => {
    const isRoleExists = await roleRepository.findRoleIsExistByName(role);
    if (isRoleExists) {
        throw new Error(ResponseMessages.role.ERROR_ROLE_EXISTS);
    }

    return await roleRepository.saveRole({
        role,
        salary,
        department_id
    });
};
 
// Update an existing role
const updateRole = async (roleId, updateData) => {
    const existingRole = await roleRepository.findRolesById(roleId);

    if (!existingRole) {
        throw new Error(ResponseMessages.role.ERROR_ROLE_ID);
    }

    // Check if a role with the same name already exists (excluding the current role)
    if (updateData.role && updateData.role !== existingRole.role) {
        const isRoleExists = await roleRepository.findRoleIsExistByName(updateData.role);
        if (isRoleExists && isRoleExists.id !== existingRole.id) {
            throw new Error(ResponseMessages.role.ERROR_ROLE_EXISTS);
        }
    }

    //Prevent changing the primary key from the request body
    delete updateData.id;

    // Merges the request body with the existing role record
    roleRepository.merge(existingRole, updateData);

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
    else if (employeesCount > 0) {
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
