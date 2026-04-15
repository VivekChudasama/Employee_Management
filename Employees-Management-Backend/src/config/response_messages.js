export class ResponseMessages {
    static employee = {
        EMPLOYEE_CREATED: "Employee created successfully",
        EMPLOYEE_UPDATED: "Employee updated successfully",
        EMPLOYEE_DELETED: "Employee deleted successfully",
        EMPLOYEE_FETCHED: "Employee data fetched successfully",
        EMPLOYEES_FETCHED: "Employees list fetched successfully",
        ERROR_FETCHING_EMPLOYEES: "Error fetching employees list",
        ERROR_FETCHING_EMPLOYEE: "Error fetching employee data",
        ERROR_ADDING_EMPLOYEE: "Error adding employee",
        ERROR_UPDATING_EMPLOYEE: "Error updating employee",
        ERROR_DELETING_EMPLOYEE: "Error deleting employee",
        ERROR_EMPLOYEE_ID_REQUIRED: "Employee ID is required",
        ERROR_EMPLOYEE_ID: "Employee not found with the provided EMPLOYEE ID",
        ERROR_EMPLOYEES_EMAIL_EXISTS: "Email address you have entered is already in use",
    };

    static role = {
        ROLE_CREATED: "Role created successfully",
        ROLE_UPDATED: "Role updated successfully",
        ROLE_DELETED: "Role deleted successfully",
        ROLE_FETCHED: "Role data fetched successfully",
        ROLES_FETCHED: "Roles list fetched successfully",
        ERROR_ROLE_EXISTS: "The role name you have entered already exists.",
        ERROR_FETCHING_ROLES: "Error fetching roles list",
        ERROR_FETCHING_ROLE: "Error fetching role",
        ERROR_ADDING_ROLE: "Error adding role",
        ERROR_UPDATING_ROLE: "Error updating role",
        ERROR_DELETING_ROLE: "Error deleting role",
        ERROR_ROLE_ID_REQUIRED: "Role ID is required",
        ERROR_ROLE_NAME_REQUIRED: "Role Name is required",
        ERROR_ROLE_ID: "Role not found with the provided ROLE ID",
        ERROR_ROLE_ASSIGNED: "Role deletion failed. Employees with this role exist in the organisation."
    };

    static department = {
        DEPARTMENT_CREATED: "Department created successfully",
        DEPARTMENT_UPDATED: "Department updated successfully",
        DEPARTMENT_DELETED: "Department deleted successfully",
        DEPARTMENT_FETCHED: "Department data fetched successfully",
        DEPARTMENTS_FETCHED: "Departments list fetched successfully",
        ERROR_DEPARTMENT_EXISTS: "The department name you have entered already exists.",
        ERROR_FETCHING_DEPARTMENTS: "Error fetching departments list",
        ERROR_FETCHING_DEPARTMENT: "Error fetching department",
        ERROR_ADDING_DEPARTMENT: "Error adding department",
        ERROR_UPDATING_DEPARTMENT: "Error updating department",
        ERROR_DELETING_DEPARTMENT: "Error deleting department",
        ERROR_DEPARTMENT_ID_REQUIRED: "Department ID is required",
        ERROR_DEPARTMENT_NAME_REQUIRED: "Department Name is required",
        ERROR_DEPARTMENT_ID: "Department not found with the provided DEPARTMENT ID",
    };

    static Route = {
        ERROR_FOUND_ROUTE: "Route not found"
    }

}