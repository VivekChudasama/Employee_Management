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
    return await roleRepository.createRole({
        role,
        salary: salary,
        department_id: department_id
    });
};

// Update an existing role
const updateRole = async ({ roleId, updatedRole, updatedSalary, updatedDepartmentId }) => {
    const existingRole = await roleRepository.findRolesById(roleId);
    if (!existingRole) return null;

    existingRole.role = updatedRole;
    existingRole.salary = updatedSalary;
    existingRole.department_id = updatedDepartmentId;

    return await roleRepository.saveRole(existingRole);
};

// Delete a role (only if not assigned to any employee)
const deleteRoleById = async (roleId) => {
    const existingRole = await roleRepository.findRolesById(roleId);
    if (!existingRole) {
        throw new Error(ResponseMessages.role.ERROR_ROLE_ID);
    }

    const employees = await employeeRepository.findEmployeeRoleById({ where: { role_id: roleId } });

    // If there are employees assigned to this role so we cannot delete the role
    if (employees && employees.length > 0) {
        throw new Error(ResponseMessages.role.ERROR_ROLE_ASSIGNED);
    }

    return await roleRepository.deleteRole({ id: roleId });
};

export default {
    findAllRoles,
    findRoleById,
    createRole,
    updateRole,
    deleteRoleById
};
