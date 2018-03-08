const _ = require('lodash');
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const config = require('../config');

const DataBase = new Sequelize({
  database: config.USERDATA_DATABASE,
  username: config.USERDATA_USERNAME,
  password: config.USERDATA_PASSWORD,
  host: config.USERDATA_SERVER,
  port: config.USERDATA_PORT,
  dialect: 'mysql',
});

const models = () => {
  const db = fs
    .readdirSync(`${__dirname}/`)
    .filter(file => file !== 'index.js')
    .reduce(
      (database, file) => {
        // eslint-disable-next-line import/no-dynamic-require,global-require
        const model = require(path.join(`${__dirname}/`, file))(DataBase, Sequelize.DataTypes);
        return Object.assign({}, database, { [_.upperFirst(model.name)]: model });
      },
      {},
    );

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return db;
};

module.exports = models();
