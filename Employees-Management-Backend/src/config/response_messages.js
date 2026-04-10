export class ResponseMessages {
    static employee = {
        EMPLOYEE_CREATED: "Employee created successfully",
        EMPLOYEE_UPDATED: "Employee updated successfully",
        EMPLOYEE_DELETED: "Employee deleted successfully",
        ERROR_FETCHING_EMPLOYEES: "Error fetching employees list",
        ERROR_FETCHING_EMPLOYEE: "Error fetching employee data",
        ERROR_ADDING_EMPLOYEE: "Error adding employee",
        ERROR_UPDATING_EMPLOYEE: "Error updating employee",
        ERROR_DELETING_EMPLOYEE: "Error deleting employee",
        ERROR_EMPLOYEE_ID_REQUIRED: "Employee ID is required",
        ERROR_EMPLOYEE_ID: "Employee not found with the provided ID",
    };

    static role = {
        ROLE_CREATED: "Role created successfully",
        ROLE_UPDATED: "Role updated successfully",
        ROLE_DELETED: "Role deleted successfully",
        ERROR_FETCHING_ROLES: "Error fetching roles list",
        ERROR_FETCHING_ROLE: "Error fetching role",
        ERROR_ADDING_ROLE: "Error adding role",
        ERROR_UPDATING_ROLE: "Error updating role",
        ERROR_DELETING_ROLE: "Error deleting role",
        ERROR_ROLE_ID_REQUIRED: "Role ID is required",
        ERROR_ROLE_ID: "Role not found with the provided ID",
        ERROR_ROLE_ASSIGNED: "Cannot delete role as it is assigned to employees"
    };

    static department = {
        DEPARTMENT_CREATED: "Department created successfully",
        DEPARTMENT_UPDATED: "Department updated successfully",
        DEPARTMENT_DELETED: "Department deleted successfully"
    };

}