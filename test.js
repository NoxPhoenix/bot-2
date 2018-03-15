function baseChannelName (channelName) {
  if (channelName.includes(channelName.match(/( [1-9])$/)[0])) return channelName.slice(0, -2);
  return channelName;
}

console.log('General 2'.includes(' 2'));
console.log(baseChannelName('General 2'));

