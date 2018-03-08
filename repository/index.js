const _ = require('lodash');

const DatabaseMixin = require('./database');
const TwitchMixin = require('./twitch');

const repository = Object.assign(
  DatabaseMixin,
  TwitchMixin,
  {
    getDataValues (modelRows) {
      return _.map(modelRows, 'dataValues');
    },
  },
);

module.exports = repository;
