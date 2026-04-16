import roleService from '../services/rolesService.js';
import { ResponseMessages } from '../config/response_messages.js'
import { Constants } from '../config/constants.js'

// Get list of all roles
const getRoles = async (req, res, next) => {
    try {
        const roles = await roleService.findAllRoles();
        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE).json({ message: ResponseMessages.role.ROLES_FETCHED, data: roles });
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
            .json({ message: ResponseMessages.role.ERROR_ADDING_ROLE, error: err.message });
    }
};

// Get role by ID for details
const getRoleDetailsById = async (req, res, next) => {
    try {
        const roleId = req.params.roleId;

        const role = await roleService.findRoleById(roleId);

        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE).json({ message: ResponseMessages.role.ROLE_FETCHED, data: role });
    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.role.ERROR_FETCHING_ROLE, error: err.message });
    }
};

// Handle edit role submission
const editRoleDetails = async (req, res, next) => {
    try {
        const roleId = req.params.roleId;
        const updateData = req.body;

        await roleService.updateRole(roleId, updateData);

        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE)
            .json({ message: ResponseMessages.role.ROLE_UPDATED });

    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.role.ERROR_UPDATING_ROLE, error: err.message });
    }
};

// Handle delete role request
const deleteRole = async (req, res, next) => {
    try {
        const roleId = req.params.roleId;

        await roleService.deleteRoleById(roleId);

        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE)
            .json({ message: ResponseMessages.role.ROLE_DELETED });
    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.role.ERROR_DELETING_ROLE, error: err.message });
    }
};

export default {
    getRoles,
    postAddRole,
    getRoleDetailsById,
    editRoleDetails,
    deleteRole
};
