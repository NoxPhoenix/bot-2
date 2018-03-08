const channelScaler = require('../../../services/channelScaler');
const { getAllScaleableChannels } = require('../../../repository');

function channelFromMemberState (memberState) {
  return memberState.voiceChannel;
}

function scaleChannel (channel) {
  channelScaler.scale(channel);
}

module.exports = (memberVoiceStateUpdate) => {
  const channel = channelFromMemberState(memberVoiceStateUpdate.newState);
  return getAllScaleableChannels()
    .then((scalableChannels) => {
      if (scalableChannels.includes(channel.id)) scaleChannel(channel);
    });
};
