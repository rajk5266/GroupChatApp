const cronJob = require('cron').CronJob;
const sequelize = require('../util/database');
const Sequelize = require('sequelize');
const Chat = require('../models/chats');
const ArchivedChats = require('../models/archivedChats');
const { CronJob } = require('cron');

const job = new CronJob("0 0 * * *", function () {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
    Chat.findAll({
      where: {
        createdAt: {
          [Sequelize.Op.lt]: yesterday,
        },
      },
    }).then((chats) => {
      ArchivedChats.bulkCreate(chats).then(() => {
        Chat.destroy({
          where: {
            createdAt: {
              [Sequelize.Op.lt]: yesterday,
            },
          },
        });
      });
    });
  });

  module.exports = job;