import {roleRepository} from '../repositories/rolesRepository.js';
import {employeeRepository} from '../repositories/employeesRepository.js';
import { ResponseMessages } from '../config/response_messages.js'

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
        throw new Error(ResponseMessages.role.ERROR_ROLE_NAME_REQUIRED);
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
        throw new Error(ResponseMessages.role.ERROR_ROLE_ID_REQUIRED);
    }

    // Check the fields are provided and not empty
    if (!updatedRole || !updatedSalary || !updatedDepartmentId) {
        throw new Error(ResponseMessages.role.ERROR_UPDATING_ROLE);
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
        throw new Error(ResponseMessages.role.ERROR_ROLE_ID_REQUIRED);
    }

    const existingRole = await roleRepository.findRolesById(roleId);
    if (!existingRole) {
        throw new Error(ResponseMessages.role.ERROR_ROLE_ID);
    }

    const employees = await employeeRepository.findEmployeeRoleById({ where: { role_id: parseInt(roleId) } });

    // If there are employees assigned to this role so we cannot delete the role
    if (employees && employees.length > 0) {
        throw new Error(ResponseMessages.role.ERROR_ROLE_ASSIGNED);
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
