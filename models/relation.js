import employees from './employees.js';
import department from './department.js';
import roles  from './roles.js';

import { JoinColumn , OneToMany , belongsTo } from 'typeorm';

// A Department has many Roles

@OneToMany(() => roles, role => role.department)
roles : roles[];

@JoinColumn({ name: 'Department_id' })
department : department;

@belongsTo(() => department, department => department.roles)

@OneToMany(() => employees, employee => employee.role)
employees : employees[];

@JoinColumn({ name: 'Role_id' })
role : roles;

@belongsTo(() => roles, role => role.employees)


// department.hasMany(roles, { foreignKey: 'Department_id' });
// roles.belongsTo(department, { foreignKey: 'Department_id' });

// // A Role has many Employees
// roles.hasMany(employees, { foreignKey: 'Role_id' });
// employees.belongsTo(roles, { foreignKey: 'Role_id' });

export default { employees, department, roles };

