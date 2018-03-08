const Promise = require('bluebird');

const models = require('./models');

console.log(models);

Promise.map([models.Streamer, models.User, models.Channel, models.Configuration], model => model.sync())
  .then(() => models.Streamer.create({ twitchId: '123', twitchUsername: 'Bobby', discordId: '345' }));

