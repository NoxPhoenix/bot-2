const channelScaler = require('../../../services/channelScaler');
const { getAllScalableChannelIds } = require('../../../repository');

function channelFromMemberState (memberState) {
  return memberState.voiceChannel;
}

function scaleChannel (channel) {
  channelScaler.scale(channel);
}

module.exports = (memberVoiceStateUpdate) => {
  const channel = channelFromMemberState(memberVoiceStateUpdate.newState);
  return getAllScalableChannelIds()
    .then((scalableChannels) => {
      console.log(scalableChannels);
      console.log(channel.id);
      if (scalableChannels.includes(channel.id)) scaleChannel(channel);
    });
};

