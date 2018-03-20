const { getAllLiveStreamers } = require('../../../../../repository');
const { evaluateStreams } = require('../../../../../services/evaluateStreamStatuses');

const replyMessage = 'Check out these live Mannfieldians!!!!';

function listStreamers (streamers, message) {
  const twitchUrls = [];
  if (!streamers.length) return message.reply('There are no live Mannfieldians right now... :frowning2:');
  streamers.forEach(({ twitchUsername }) => {
    twitchUrls.push(`https://twitch.tv/${twitchUsername}`);
  });
  const listOfUrls = twitchUrls.join('\r\n');
  return message.reply(`
${replyMessage}

${listOfUrls}`);
}

module.exports = {
  watch ({ message }) {
    evaluateStreams()
      .then(() => (
        getAllLiveStreamers()
          .then(streamers => listStreamers(streamers, message))
      ));
  },
};
