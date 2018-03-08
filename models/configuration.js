const Sequelize = require('sequelize');

module.exports = (database) => {
  return database.define('configuration', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: Sequelize.ENUM,
      values: ['defaultRole', 'welcomeMessage'],
      allowNull: false,
      unique: true,
    },
    value: {
      type: Sequelize.TEXT,
    },
  });
};
