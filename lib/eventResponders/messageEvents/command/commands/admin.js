const _ = require('lodash');

const repository = require('../../../../../repository');
const wumpus = require('../../../../../utils/wumpus');

const notAdminError = 'You are not authorized to use this command. Please contact and admin...';
const notValidAlertTypeError = `That is not a valid alert type! You can only set alerts for...
    - podcast
    - stream`;

function adminCheck (userId) {
  return repository.getAllAdmins()
    .then(admins => admins.includes(userId));
}

function allowAdmin (message) {
  return adminCheck(message.author.id)
    .then((isAdmin) => {
      if (!isAdmin) throw new Error(notAdminError);
    });
}

function setPodcastAert (channelId) {
  return repository.createAlertChannel(channelId, 'podcastAlert');
}

function removePodcastAert (channelId) {
  return repository.deleteAlertChannel(channelId, 'podcastAlert');
}

function setStreamAlert (channelId) {
  return repository.createAlertChannel(channelId, 'streamAlert');
}

function removeStreamAlert (channelId) {
  return repository.deleteAlertChannel(channelId, 'streamAlert');
}

function setHostAlert (channelId) {
  return repository.createAlertChannel(channelId, 'hostAlert');
}

function removeHostAlert (channelId) {
  return repository.deleteAlertChannel(channelId, 'hostAlert');
}

const setCommands = {
  admin ({ message, args }) {
    const userId = wumpus.getMemberIdInGuild(args.shift(), message.guild.members);
    if (!userId) return message.reply('Could not find that user in the discord!');
    return allowAdmin(message)
      .then(() => repository.updateAdmin(userId, true))
      .then(() => message.reply('Admin created successfully!'))
      .catch(err => message.reply(`Error creating admin: ${err.message}`));
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

  scaler ({ message, args }) {
    const channel = wumpus.getChannelIdFromGuild(args[0], message.guild);
    return repository.addScalableChannel(channel);
  },

  stream ({ message, args }) {
    const discordUserId = wumpus.getMemberIdInGuild(args[0], message.guild.members);
    const submittedTwitchUsername = args[1];
    return repository.getTwitchUserByUsername(submittedTwitchUsername)
      .then(({ id: twitchId, display_name: twitchUsername }) => repository.createStreamerWithDiscordId(discordUserId, { twitchUsername, twitchId }))
      .then(({ twitchUsername }) => message.reply(`Mannfieldians will now be notified when ${twitchUsername} goes live!`));
  },

  welcome ({ message, args }) {
    const welcome = args.join(' ');
    allowAdmin(message)
      .then(() => repository.updateWelcomeMessage(welcome));
  },
};

const removeCommands = {
  admin ({ message, args }) {
    const userId = wumpus.getMemberIdInGuild(args.shift(), message.guild.members);
    if (!userId) return message.reply('Could not find that user in the discord!');
    return allowAdmin(message)
      .then(() => repository.updateAdmin(userId, false))
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
