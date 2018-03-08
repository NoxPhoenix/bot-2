const Promise = require('bluebird');
const TwitchHelix = require('twitch-helix');

const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = require('../config');

const twitch = new TwitchHelix({
  clientId: TWITCH_CLIENT_ID,
  clientSecret: TWITCH_CLIENT_SECRET,
});

module.exports = {
  getTwitchUserById (id) {
    return twitch.getTwitchUserById(id);
  },

  getTwitchUserByUsername (username) {
    return twitch.getTwitchUserByUsername(username);
  },

  getTwitchUsersByUsernames (usernames = []) {
    return twitch.getTwitchUsersByName(usernames);
  },

  getStreamInfoById (id) {
    return twitch.getStreamInfoById(id);
  },

  getStreamInfoByUsername (username) {
    return twitch.getStreamInfoByUsername(username);
  },

  getStreamInfoByUsernames (usernames = []) {
    const promiseArray = [];

    usernames.forEach(username => promiseArray.push(twitch.getStreamInfoByUsername(username)));
    return Promise.all(promiseArray);
  },

};
