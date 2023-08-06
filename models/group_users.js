const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const GroupUsers = sequelize.define('group_users', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username:{
       type: Sequelize.STRING,
       allowNull:false
    },
     groupId: {
        type: Sequelize.INTEGER,
        // defaultValue: false,
        allowNull:false,
     },
     isAdmin: {
        type:Sequelize.BOOLEAN,
        allowNull: false
     }

});

module.exports = GroupUsers;
