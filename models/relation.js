const employees = require('./models/employees');
const department = require('./models/department');
const roles = require('./models/roles');

// A Department has many Roles
department.hasMany(roles, { foreignKey: 'Department_id' });
roles.belongsTo(department, { foreignKey: 'Department_id' });

// A Role has many Employees
roles.hasMany(employees, { foreignKey: 'Role_id' });
employees.belongsTo(roles, { foreignKey: 'Role_id' });

module.exports = {
    employees,
    department,
    roles
};
