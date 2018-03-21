const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const { commandAndArgsFromMessage } = require('../../../../utils/wumpus');

function getCommands () {
  const files = fs.readdirSync(`${__dirname}/commands`);

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const commandObjects = files.map(file => require(`./commands/${file}`));
  return Object.assign({}, ...commandObjects);
}

const commands = getCommands();

module.exports = {
  call (message) {
    const { command, args } = commandAndArgsFromMessage(message);
    if (!commands[command]) return message.reply(`Command, ${command} does not exist!`);
    return commands[command]({ message, args });
  },
};
