const Promise = require('bluebird');
const _ = require('lodash');

const { addScalableChannel, deleteScalableChannel } = require('../repository');

function channelIsDuplicate (channelName) {
  if (channelName.match(/( [1-9])$/)) return true;
  return false;
}

function baseChannelName (channelName) {
  if (!channelIsDuplicate(channelName)) return channelName;
  return channelName.slice(0, -2);
}

const Scaler = {

  memberCount ({ members }) {
    return members.size;
  },

  duplicatesCheck (channel) {
    const channelName = channel.name;
    const duplicates = [];
    return Promise.map(channel.guild.channels.array(), (c) => {
      if (c.name.startsWith(baseChannelName(channelName))) duplicates.push(c);
      return Promise.resolve();
    })
      .then(() => duplicates);
  },

  emptyDuplicates (channel) {
    const emptyDupes = [];
    return this.duplicatesCheck(channel)
      .then((duplicates) => {
        return Promise.map(duplicates, (c) => {
          if (this.memberCount(c) === 0) emptyDupes.push(c);
          return Promise.resolve();
        })
          .then(() => emptyDupes);
      });
  },

  correctChannelNames (duplicates) {
    const sortedChannels = _.sortBy(duplicates, ['name']);
    const baseName = sortedChannels.shift().name;
    for (let i = 0; i < sortedChannels.length; i++) {
      sortedChannels[i].setName(`${baseName} ${i + 2}`);
    }
  },

  duplicate (channel) {
    return this.duplicatesCheck(channel)
      .then(duplicates => (
        channel.guild.createChannel(`${baseChannelName(channel.name)} ${duplicates.length + 1}`, 'voice')
          .then(newChannel => Promise.all([addScalableChannel(newChannel.id), newChannel.setPosition(channel.calculatedPosition + 1)]))
      ));
  },

  scale (channel, threshold = 1) {
    return this.emptyDuplicates(channel)
      .then((emptyDupes) => {
        if (channel.members.size >= threshold && emptyDupes.length === 0) return this.duplicate(channel);
        return null;
      });
  },

  scaleDown (channel) {
    this.emptyDuplicates(channel)
      .then((emptyDupes) => {
        emptyDupes.splice(0, 1);
        return Promise.map(emptyDupes, (duplicateChannel) => {
          return deleteScalableChannel(duplicateChannel.id)
            .then(() => duplicateChannel.delete());
        });
      })
      .then(() => this.duplicatesCheck(channel))
      .then(duplicates => this.correctChannelNames(duplicates, channel));
  },
};

module.exports = Scaler;
