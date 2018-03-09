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

  // Scaleable channel configurations
  getAllScaleableChannels () {
    return Channel.findAll({ where: { type: 'scaleable' } })
      .then(channels => channels.map(channel => channel.channelId));
  },

  addScaleableChannel (channelId) {
    return Channel.findOrCreate({
      where: {
        channelId,
        type: 'scaleable',
      },
    });
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
    return Channel.findAll({ where: { type: 'alert' } })
      .then(channels => channels.map(channel => channel.channelId));
  },

  // User account management
  deleteUserAccount (discordId) {
    return User.findOne({ where: { discordId } })
      .then(user => user.destroy());
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

  getStreamerByDiscordId (discordId) {
    Streamer.findOne({
      include: [{
        model: User,
        where: { discordId },
      }],
    });
  },

  getAllStreamers () {
    Streamer.findAll();
  },

  getAllLiveStreamers () {
    Streamer.findAll({ where: { live: true } });
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
