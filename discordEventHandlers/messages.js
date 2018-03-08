const messageEvents = require('../lib/eventResponders/messageEvents');

class MessageHandler {
  constructor (bot) {
    this.bot = bot;
    this.bot.on('message', (message) => {
      if (message.author.bot || message.channel.type !== 'text') return;
      messageEvents.newMessage(message);
    });
  }
}

function messageHandler (bot) {
  return new MessageHandler(bot);
}

module.exports = messageHandler;
