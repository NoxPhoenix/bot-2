function requireLink (message) {
  if (message.content.includes('http' || 'www')) return true;
  message.delete();
  message.author.send('Posts in that channel must contain a link!');
  return false;
}

const mod = {
  selfPromotion (message) {
    requireLink(message);
  },
};

module.exports = (message) => {
  const { channel } = message;
  if (!mod[channel.name] || channel.type !== 'text') return;
  mod[message.channel.name](message);
};
