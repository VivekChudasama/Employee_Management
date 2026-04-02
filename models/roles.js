const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Role = sequelize.define('role', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    role: { 
        type: Sequelize.STRING, 
        allowNull: false 
    },
    salary: { 
        type: Sequelize.INTEGER, 
        allowNull: false 
    },
    department_id: {
        type: Sequelize.INTEGER,
        allowNull: false ,
        field: 'Department_id',
        references: {
            model: 'department',
            key: 'id'
        }
    }
});

module.exports = Role;
