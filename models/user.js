const Sequelize = require('sequelize');

module.exports = (database) => {
  const User = database.define(
    'user',
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      discordId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      steamId: {
        type: Sequelize.STRING,
      },
      psnId: {
        type: Sequelize.STRING,
      },
      xboxId: {
        type: Sequelize.STRING,
      },
      admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      patron: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
  );

  User.associate = (db) => {
    db.User.hasOne(
      db.Streamer,
      {
        as: 'stream',
        foreignKey: {
          allowNull: false,
          unique: true,
        },
        onDelete: 'CASCADE',
      },
    );
  };

  return User;
};
