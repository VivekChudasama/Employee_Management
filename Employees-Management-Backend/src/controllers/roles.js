import roleService from '../services/roles.js';
import { ResponseMessages } from '../config/response_messages.js'
import { Constants } from '../config/constants.js'

// Get list of all roles
const getRoles = async (req, res, next) => {
    try {
        const roles = await roleService.findAllRoles();
        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE).json(roles);
    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.role.ERROR_FETCHING_ROLES, error: err.message });
    }
};

// Handle add role form submission
const postAddRole = async (req, res, next) => {
    try {
        const { role, salary, department_id } = req.body;

        await roleService.createRole({ role, salary, department_id });

        res.status(Constants.RESPONSE_STATUS_CODE.CREATED_SUCCESS_CODE)
            .json({ message: ResponseMessages.role.ROLE_CREATED });
    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.role.ERROR_ADDING_ROLE });
    }
};

// Get role by ID for details
const getRoleDetailsById = async (req, res, next) => {
    try {
        const roleId = req.params.roleId;

        const role = await roleService.findRoleById(roleId);
        if (!role) {
            return res.status(Constants.RESPONSE_STATUS_CODE.NOT_FOUND_CODE)
                .json({ message: ResponseMessages.role.ERROR_ROLE_ID });
        }

        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE).json(role);
    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.role.ERROR_FETCHING_ROLE, error: err.message });
    }
};

// Handle edit role submission
const editRoleDetails = async (req, res, next) => {
    try {
        const { role_id, role, salary, department_id } = req.body;

        const existingRole = await roleService.findRoleById(role_id);

        if (!existingRole) {
            return res.status(Constants.RESPONSE_STATUS_CODE.NOT_FOUND_CODE)
                .json({ message: ResponseMessages.role.ERROR_ROLE_ID });
        }

        const result = await roleService.updateRole(
            { roleId: role_id, updatedRole: role, updatedSalary: salary, updatedDepartmentId: department_id }
        );
        if (result) return res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE)
            .json({ message: ResponseMessages.role.ROLE_UPDATED });

    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.role.ERROR_UPDATING_ROLE});
    }
};

// Handle delete role request
const deleteRole = async (req, res, next) => {
    try {
        const  roleId  = req.params.roleId;

        const existingRole = await roleService.findRoleById(roleId);

        if (!existingRole) {
            return res.status(Constants.RESPONSE_STATUS_CODE.NOT_FOUND_CODE)
                .json({ message: ResponseMessages.role.ERROR_ROLE_ID });
        }

        await roleService.deleteRoleById(roleId);

        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE)
            .json({ message: ResponseMessages.role.ROLE_DELETED });
    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: err.message });
    }
};

export default {
    getRoles,
    postAddRole,
    getRoleDetailsById,
    editRoleDetails,
    deleteRole
};
