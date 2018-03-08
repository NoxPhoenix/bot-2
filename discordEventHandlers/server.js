const serverEvents = require('../lib/eventResponders/serverEvents');

class ServerHandler {
  constructor (bot) {
    this.bot = bot;
    this.bot.on('guildMemberAdd', member => (
      serverEvents.join(member)
    ));
    this.bot.on('guildMemberRemove', member => (
      serverEvents.leave(member)
    ));
  }
}

function serverHandler (bot) {
  return new ServerHandler(bot);
}

module.exports = serverHandler;
