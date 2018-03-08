const Sequelize = require('sequelize');

module.exports = (database) => {
  return database.define('channel', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    channelId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM,
      values: ['scalable', 'podcastAlert', 'streamAlert', 'hostAlert'],
    },
  });
};
