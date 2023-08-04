const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const Groups = sequelize.define('groups', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    groupname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    admin: {
        type: Sequelize.STRING,
        allowNull :false
    }
});

module.exports = Groups