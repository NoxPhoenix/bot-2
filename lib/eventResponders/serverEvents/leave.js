const Promise = require('bluebird');
const _ = require('lodash');

const { deleteUserAccount, getAllAdmins } = require('../../../repository');

function notifyAdmins (member) {
  return getAllAdmins()
    .then((adminIds) => {
      const currentModIds = _.pull(adminIds, member.id)
      const mods = currentModIds.map(id => member.guild.members.get(id));
      return Promise.map(mods, mod => mod.send(`${member.user.username} has left the discord! :frowning2:`));
    });
}

function deleteUser (member) {
  return deleteUserAccount(member.id);
}

module.exports = (member) => {
  return Promise.map([
    notifyAdmins,
    deleteUser,
  ], task => task(member));
};
