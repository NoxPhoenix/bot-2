const Discord = require('discord.js');

global.admin = {};

const { TOKEN } = require('./config');

const bot = new Discord.Client();

// Listener for RSS Feed changes for the podcast
require('./utils/podcastFeed')(bot);

require('./discordEventHandlers/messages')(bot);
require('./discordEventHandlers/voiceChannels')(bot);
require('./discordEventHandlers/server')(bot);

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login(TOKEN);
