const moderation = require('../../../utils/moderation');
const command = require('./command');

const { PREFIX } = require('../../../config');

module.exports = (message) => {
  const { content } = message;
  moderation(message);
  if (content.startsWith(PREFIX)) command.call(message);
};
