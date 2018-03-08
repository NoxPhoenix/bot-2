const channelScaler = require('../../../services/channelScaler');
const { getAllScaleableChannels } = require('../../../repository');

function channelFromMemberState (memberState) {
  return memberState.voiceChannel;
}

function scaleDownChannel (channel) {
  channelScaler.scaleDown(channel);
}

module.exports = (memberVoiceStateUpdate) => {
  const channel = channelFromMemberState(memberVoiceStateUpdate.newState);
  return getAllScaleableChannels()
    .then((scalableChannels) => {
      if (scalableChannels.includes(channel.id)) scaleDownChannel(channel);
    });
};
