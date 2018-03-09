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
        unique: true,
      },
      twitchUsername: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      live: {
        type: Sequelize.BOOLEAN,
      },
    },
  );

  Streamer.associate = (db) => {
    db.Streamer.belongsTo(
      db.User,
      {
        as: 'userId',
        foreignKey: {
          allowNull: false,
          unique: true,
        },
        onDelete: 'CASCADE',
      },
    );
  };

  return Streamer;
};
