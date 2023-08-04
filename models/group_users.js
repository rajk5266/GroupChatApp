const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const GroupUsers = sequelize.define('group_users', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    //  isadmin: {
    //     type: Sequelize.BOOLEAN,
    //     defaultValue: false,
    //  },
    
});

module.exports = GroupUsers;
