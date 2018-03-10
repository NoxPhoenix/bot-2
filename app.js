const Promise = require('bluebird');

const bot = require('./bot');
const { TOKEN } = require('./config');


// Listener for RSS Feed changes for the podcast
require('./utils/podcastFeed')(bot);

require('./utils/streamPolling');

require('./discordEventHandlers/messages')(bot);
require('./discordEventHandlers/voiceChannels')(bot);
require('./discordEventHandlers/server')(bot);

bot.on('ready', () => {
  console.log('I am ready!');
});

const models = require('./models');

Promise.map(Object.keys(models), model => models[model].sync())
  .then(() => bot.login(TOKEN));

