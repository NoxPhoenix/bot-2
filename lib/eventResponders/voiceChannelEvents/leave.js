const channelScaler = require('../../../services/channelScaler');
const { getAllScalableChannelIds } = require('../../../repository');

function channelFromMemberState (memberState) {
  return memberState.voiceChannel;
}

function scaleDownChannel (channel) {
  channelScaler.scaleDown(channel);
}

module.exports = (memberVoiceStateUpdate) => {
  const channel = channelFromMemberState(memberVoiceStateUpdate.oldState);
  return getAllScalableChannelIds()
    .then((scalableChannels) => {
      if (scalableChannels.includes(channel.id)) scaleDownChannel(channel);
    });
};
