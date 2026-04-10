import roleService from '../services/roles.js';
import { ResponseMessages } from '../config/response_messages.js'
import { Constants } from '../config/constants.js'

// Get list of all roles
const getRoles = async (req, res, next) => {
    try {
        const roles = await roleService.findAllRoles();
        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE).json(roles);
    } catch (err) {
        console.log(err)
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.role.ERROR_FETCHING_ROLES, error: err.message });
    }
};

// Handle add role form submission
const postAddRole = async (req, res, next) => {
    try {
        const { role, salary, department_id } = req.body;

        const result = await roleService.createRole({ role, salary, department_id });

        console.log('Role added');
        res.status(Constants.RESPONSE_STATUS_CODE.CREATED_SUCCESS_CODE)
            .json({ message: ResponseMessages.role.ROLE_CREATED });
    } catch (err) {
        console.log(err)
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
        console.log(err)
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: ResponseMessages.role.ERROR_FETCHING_ROLE, error: err.message });
    }
};

// Handle edit role submission
const editRole = async (req, res, next) => {
    try {
        const { id, role, salary, department_id } = req.body;

        const result = await roleService.updateRole(
            { roleId: id, updatedRole: role, updatedSalary: salary, updatedDepartmentId: department_id }
        );
        if (!result) return res.status(Constants.RESPONSE_STATUS_CODE.NOT_FOUND_CODE)
            .json({ message:  ResponseMessages.role.ERROR_ROLE_ID });

        res.status(Constants.RESPONSE_STATUS_CODE.SUCCESS_CODE)
            .json({ message: ResponseMessages.role.ROLE_UPDATED });
    } catch (err) {
        res.status(Constants.RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR_CODE)
            .json({ message: err.message });
    }
};

// Handle delete role request
const deleteRole = async (req, res, next) => {
    try {
        const { id } = req.body;

        await roleService.deleteRoleById(id);

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
    editRole,
    deleteRole
};
