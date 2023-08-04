const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const Chat = sequelize.define("chats", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
  },
  message: {
    type: Sequelize.STRING,
  },
  userId:{
    type:Sequelize.INTEGER,
    allowNull: false
  },
  groupId: {
   type: Sequelize.INTEGER,
   allowNull: false
  },
  date: {
   type: Sequelize.STRING,
   allowNull: false 
  }
});

module.exports = Chat;