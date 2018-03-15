const bot = require('../bot');

const {
  getAllStreamers,
  getStreamInfoByUsernames,
  setLiveStatus,
  getAllAlertChannels,
} = require('../repository');

const liveNotification = username => `${username} is now live! Check them out at https://twitch.tv/${username}`;

function pushNotification (twitchUsername) {
  return getAllAlertChannels()
    .then((channels) => {
      console.log(channels);
      if (channels.length) channels.map(channel => bot.channels.get(channel).send(liveNotification(twitchUsername)));
    });
}

// If there is no stream info for a streamer set to live in db, then there are now offline and their info must be set to 'off.'
function verifyStoredStatus ({ twitchId, twitchUsername }, streamInfos) {
  if (!streamInfos.find(({ user_id: id }) => id === twitchId)) setLiveStatus(twitchUsername, false);
}


function synchronizeStatus ({ user_id: id }, streamers) {
  const streamer = streamers.find(({ twitchId }) => twitchId === id);
  if (!streamer.live) {
    setLiveStatus(streamer.twitchUsername, true);
    pushNotification(streamer.twitchUsername);
  }
}

function evaluateStatuses (streamers, streamInfos) {
  const streamersSetToLive = streamers.filter(({ live }) => live);
  streamersSetToLive.map(streamer => verifyStoredStatus(streamer, streamInfos));
  if (streamInfos.length > 0) {
    streamInfos.map(streamInfo => synchronizeStatus(streamInfo, streamers));
  }
}

function evaluateStreams () {
  return getAllStreamers()
    .then((streamers) => {
      const streamerUsernames = streamers.map(({ twitchUsername }) => twitchUsername);
      return getStreamInfoByUsernames(streamerUsernames)
        .then(streamInfos => evaluateStatuses(streamers, streamInfos.filter(a => a))); // only passes the non null streamInfos
    });
}

module.exports = { evaluateStreams };
