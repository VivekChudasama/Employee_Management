import { roleRepository } from '../repositories/rolesRepository.js';
import { employeeRepository } from '../repositories/employeesRepository.js';
import { departmentRepository } from '../repositories/departmentRepository.js';
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
const createRole = async (roleData) => {
    const isRoleExists = await roleRepository.findRoleIsExistByName(roleData.role);
    if (isRoleExists) {
        throw new Error(ResponseMessages.role.ERROR_ROLE_EXISTS);
    }

    // Verify department exists before saving
    const deptExist = await departmentRepository.findDepartmentById(roleData.department_id);
    if (!deptExist) {
        throw new Error(ResponseMessages.department.ERROR_DEPARTMENT_ID);
    }

    return await roleRepository.saveRole(roleData);
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

    // Verify department exists if department_id is being updated
    if (updateData.department_id && updateData.department_id !== existingRole.department_id) {
        const deptExist = await departmentRepository.findDepartmentById(updateData.department_id);
        if (!deptExist) {
            throw new Error(ResponseMessages.department.ERROR_DEPARTMENT_ID);
        }
    }

    //Prevent changing the primary key from the request body
    delete updateData.id;

    return await roleRepository.updateRole(existingRole , updateData);
};

// Delete a role (only if not assigned to any employee)
const deleteRoleById = async (roleId) => {
    const existingRole = await roleRepository.findRolesById(roleId);

    if (!existingRole) {
        throw new Error(ResponseMessages.role.ERROR_ROLE_ID);
    }

    const employeesCount = await employeeRepository.countEmployeesByRoleId(roleId);

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
