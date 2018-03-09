const Promise = require('bluebird');
const { getStreamInfoByUsernames } = require('./repository');

getStreamInfoByUsernames(['Dareyck'])
  .then(console.log);
