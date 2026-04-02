const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Department = sequelize.define('department', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  departmentName : {
    type : Sequelize.STRING,
    allowNull : false,
    field : 'Department_Name'
  } 
});

module.exports = Department;
