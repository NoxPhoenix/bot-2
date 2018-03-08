const Sequelize = require('sequelize');

module.exports = (database) => {
  const Streamer = database.define(
    'streamer',
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      twitchId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      twitchUsername: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
  );

  Streamer.associate = (db) => {
    db.Streamer.belongsTo(
      db.User,
      { as: 'user', targetKey: 'discordId' },
    );
  };

  return Streamer;
};
