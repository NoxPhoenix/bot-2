const Promise = require('bluebird');

const { getDefaultRole, getWelcomeMessage, getAllAdmins } = require('../../../repository');

const defaultWelcomeMessage = 'Welcome to the server';

function welcome (member) {
  return getWelcomeMessage()
    .then((message = null) => {
      if (!message) return defaultWelcomeMessage;
      return message;
    })
    .then(message => member.guild.systemChannel.send(`${message} <@${member.user.id}>`));
}

function giveDefaultRole (member) {
  return getDefaultRole()
    .then(({ value: roleId }) => member.addRole(roleId))
    .catch(err => console.warn('Could not set default role', err));
}

function notifyAdmins (member) {
  return getAllAdmins()
    .then((adminIds) => {
      const mods = adminIds.map(id => member.guild.members.get(id));
      return Promise.map(mods, mod => mod.send(`Make sure to welcome ${member.user.username} to the discord!`));
    });
}

module.exports = (member) => {
  return Promise.map([
    welcome,
    giveDefaultRole,
    notifyAdmins,
  ], task => task(member));
};
