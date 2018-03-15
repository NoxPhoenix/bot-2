const {
  User,
  Configuration,
  Channel,
  Streamer,
} = require('../models');

function errWarn (err) {
  console.warn(err);
  return undefined;
}

module.exports = {
  getDefaultRole () {
    return Configuration.findOne({ where: { name: 'defaultRole' } })
      .then(({ value }) => value)
      .catch(errWarn);
  },

  // Welcome message configuration
  getWelcomeMessage () {
    return Configuration.findOne({ where: { name: 'welcomeMessage' } })
      .then(({ value }) => value)
      .catch(errWarn);
  },

  updateWelcomeMessage (welcomeMessage) {
    return Configuration.findOrCreate({ where: { name: 'welcomeMessage' } })
      .spread(({ id }) => Configuration.update(
        {
          value: welcomeMessage,
        },
        {
          where: {
            id,
          },
        },
      ));
  },

  // Scalable channel configurations
  getAllScalableChannelIds () {
    return Channel.findAll({ where: { type: 'scalable' } })
      .then(channels => channels.map(channel => channel.channelId));
  },

  addScalableChannel (channelId) {
    return Channel.findOrCreate({
      where: {
        channelId,
        type: 'scalable',
      },
    });
  },

  deleteScalableChannel (channelId) {
    return Channel.destroy({ where: { channelId } });
  },

  // Admins management
  getAllAdmins () {
    return User.findAll({ where: { admin: true } })
      .then(users => users.map(user => user.discordId));
  },

  updateAdmin (discordId, setting = false) {
    return User.findOrCreate({ where: { discordId } })
      .spread(({ id }) => User.update({ admin: setting }, { where: { id } }));
  },

  getAllAlertChannels () {
    return Channel.findAll({ where: { type: 'streamAlert' } })
      .then(channels => channels.map(channel => channel.channelId));
  },

  // User account management
  deleteUserAccount (discordId) {
    return User.findOne({ where: { discordId } })
      .then((user) => {
        if (user) user.destroy();
      });
  },

  // Streamer Management
  createStreamer (userId, { twitchId, twitchUsername }) {
    return Streamer.findOrCreate({
      where: {
        userId,
      },
      defaults: {
        twitchId,
        twitchUsername,
      },
    })
      .spread(streamer => streamer);
  },

  createStreamerWithDiscordId (discordId, twitchInfo) {
    return User.findOrCreate({ where: { discordId } })
      .spread(({ id }) => this.createStreamer(id, twitchInfo));
  },

  getStreamerByDiscordId (discordId) {
    return Streamer.findOne({
      include: [{
        model: User,
        where: { discordId },
      }],
    });
  },

  getAllStreamers () {
    return Streamer.findAll();
  },

  getAllLiveStreamers () {
    return Streamer.findAll({ where: { live: true } });
  },

  setLiveStatus (twitchUsername, status) {
    Streamer.update({ live: status }, { where: { twitchUsername } });
  },

  // Alert channel management
  createAlertChannel (channelId, alertType) {
    Channel.findOrCreate({ where: { channelId, type: alertType } });
  },

  deleteAlertChannel (channelId, alertType) {
    Channel.destroy({ where: { channelId, type: alertType } });
  },
};
