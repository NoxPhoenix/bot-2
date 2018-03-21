const voiceChannelEvents = require('../lib/eventResponders/voiceChannelEvents');

function stateChangeType ({ oldState, newState }) {
  if (oldState.voiceChannelID !== newState.voiceChannelID && newState.voiceChannelID !== null) return 'joinedChannel';
  if (oldState.voiceChannelID !== newState.voiceChannelID && newState.voiceChannelID !== null) return 'movedChannel';
  else if (newState.voiceChannelID === null) return 'leftChannel';
  return null;
}

class VoiceChannelsHandler {
  constructor (bot) {
    this.bot = bot;
    this.bot.on('voiceStateUpdate', (oldState, newState) => {
      const memberVoiceStateUpdate = { oldState, newState };
      switch (stateChangeType(memberVoiceStateUpdate)) {
        case 'joinedChannel':
          return voiceChannelEvents.join(memberVoiceStateUpdate);
        case 'movedChannel':
          return voiceChannelEvents.move(memberVoiceStateUpdate);
        case 'leftChannel':
          return voiceChannelEvents.leave(memberVoiceStateUpdate);
        default: return null;
      }
    });
  }
}

function voiceChannelsHandler (bot) {
  return new VoiceChannelsHandler(bot);
}

module.exports = voiceChannelsHandler;
