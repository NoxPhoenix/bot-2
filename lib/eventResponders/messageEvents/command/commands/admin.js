const _ = require('lodash');

const {
  getAllAdmins,
  updateAdmin,
  updateWelcomeMessage,
  createAlertChannel,
  deleteAlertChannel,
  addStreamInfo,
} = require('../../../../../repository');
const wumpus = require('../../../../../utils/wumpus');

const notAdminError = 'You are not authorized to use this command. Please contact and admin...';
const notValidAlertTypeError = `That is not a valid alert type! You can only set alerts for...
    - podcast
    - stream`;

function adminCheck (userId) {
  return getAllAdmins()
    .then(admins => admins.includes(userId));
}

function allowAdmin (message) {
  return adminCheck(message.author.id)
    .then((isAdmin) => {
      if (!isAdmin) throw new Error(notAdminError);
    });
}

function setPodcastAert (channelId) {
  return createAlertChannel(channelId, 'podcastAlert');
}

function removePodcastAert (channelId) {
  return deleteAlertChannel(channelId, 'podcastAlert');
}

function setStreamAlert (channelId) {
  return createAlertChannel(channelId, 'streamAlert');
}

function removeStreamAlert (channelId) {
  return deleteAlertChannel(channelId, 'streamAlert');
}

function setHostAlert (channelId) {
  return createAlertChannel(channelId, 'hostAlert');
}

function removeHostAlert (channelId) {
  return deleteAlertChannel(channelId, 'hostAlert');
}

const setCommands = {
  admin ({ message, args }) {
    const userId = wumpus.getMemberIdInGuild(args.shift(), message.guild.members);
    if (!userId) return message.reply('Could not find that user in the discord!');
    return allowAdmin(message)
      .then(() => updateAdmin(userId, true))
      .then(() => message.reply('Admin created successfully!'))
      .catch(err => message.reply(`Error creating admin: ${err.message}`));
  },

  welcome ({ message, args }) {
    const welcome = args.join(' ');
    allowAdmin(message)
      .then(() => updateWelcomeMessage(welcome));
  },

  alert ({ message, args }) {
    const alertType = args.shift();
    return allowAdmin(message)
      .then(() => {
        switch (alertType) {
          case 'podcast':
            return setPodcastAert(wumpus.getChannelIdFromGuild(args[0], message.guild));
          case 'stream':
            return setStreamAlert(wumpus.getChannelIdFromGuild(args[0], message.guild));
          case 'host':
            return setHostAlert(wumpus.getChannelIdFromGuild(args[0], message.guild));
          default:
            return message.reply(notValidAlertTypeError);
        }
      })
      .then(() => message.reply(`${_.capitalize(alertType)} alerts will now be posted to #${args[0]}`));
  },

  stream ({ message, args }) {
    return addStreamInfo(args[0], )
  },
};

const removeCommands = {
  admin ({ message, args }) {
    const userId = wumpus.getMemberIdInGuild(args.shift(), message.guild.members);
    if (!userId) return message.reply('Could not find that user in the discord!');
    return allowAdmin(message)
      .then(() => updateAdmin(userId, false))
      .then(() => message.reply('Admin removed successfully!'));
  },

  alert ({ message, args }) {
    const alertType = args.shift();
    return allowAdmin(message)
      .then(() => {
        switch (alertType) {
          case 'podcast':
            return removePodcastAert(wumpus.getChannelIdFromGuild(args[0], message.guild));
          case 'stream':
            return removeStreamAlert(wumpus.getChannelIdFromGuild(args[0], message.guild));
          case 'host':
            return removeHostAlert(wumpus.getChannelIdFromGuild(args[0], message.guild));
          default:
            return message.reply(notValidAlertTypeError);
        }
      })
      .then(() => message.reply(`${_.capitalize(alertType)} alerts will no longer be posted to #${args[0]}`));
  },
};

module.exports = {
  set ({ message, args }) {
    const command = args.shift();
    if (!setCommands[command]) return message.reply('That set command does not exist...');
    return setCommands[command]({ message, args })
      .catch(err => message.reply(`Error creating admin: ${err.message}`));
  },

  remove ({ message, args }) {
    const command = args.shift();
    if (!removeCommands[command]) return message.reply('That remove command does not exist...');
    return removeCommands[command]({ message, args })
      .catch(err => message.reply(`Error removing admin: ${err.message}`));
  },
};
