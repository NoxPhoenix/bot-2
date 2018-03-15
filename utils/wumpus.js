const _ = require('lodash');

const bot = require('../bot');

const { PREFIX } = require('../config');

module.exports = {
  commandAndArgsFromMessage ({ content }) {
    const args = content.slice(PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    return { command, args };
  },

  cleanIdFromUserTag (userTag) {
    return userTag.replace('<@', '').replace('>', '');
  },

  getMemberFromUsername (username, membersMap) {
    const member = membersMap.array().find(a => a.user.username === username);
    if (member) return member;
    return null;
  },

  getIdFromUsername (username, membersMap) {
    const member = membersMap.array().find(a => a.user.username === username);
    if (member) return member.id;
    return null;
  },

  getMemberIdInGuild (userInfo, membersMap) {
    const member = userInfo.includes('@') ? membersMap.get(this.cleanIdFromUserTag(userInfo, membersMap)) : this.getMemberFromUsername(userInfo, membersMap);
    if (!member) return null;
    return member.id;
  },

  getChannelIdFromGuild (channelName, guild) {
    const channel = _.find(guild.channels.array(), { name: channelName });
    if (!channel) return null;
    return channel.id;
  },
};
