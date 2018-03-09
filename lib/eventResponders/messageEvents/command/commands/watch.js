const { getAllLiveStreamers } = require('../../../../../repository');

const replyMessage = 'Check out these live Mannfieldians!!!!';

module.exports = {
  watch ({ message }) {
    const twitchUrls = [];
    getAllLiveStreamers()
      .then((streamers) => {
        streamers.forEach(({ twitchUsername }) => {
          twitchUrls.push(`https://twitch.tv/${twitchUsername}`);
        });
        const listOfUrls = twitchUrls.join('\r\n');
        return message.reply(`
        ${replyMessage}
          ${listOfUrls}`);
      });
  },
};
