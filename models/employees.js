const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const { stat } = require('node:fs');

const Employees = sequelize.define('employees', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'Role_id',
        references: {
            model: 'role',
            key: 'id'
        }
    },
    status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false
    }
});

module.exports = Employees;
