const repository = require('../../../../../repository');

function adminCheck (userId) {
  return repository.getAllAdmins()
    .then(admins => admins.includes(userId));
}

module.exports = {
  help ({ message }) {
    return adminCheck(message.author.id)
      .then((isAdmin) => {
        let helpMessage = `
You can use the following commands...

+watch
List of all registered streamers who are live!

`;
        const adminHelp = `
I also see you are an admin...

+set
    - stream    (+set stream {user} {twitchName})
sets live notifications for streamer.

    - admin     (+set admin {user})
sets user as a bot admin.

    - alert     (+set alert {podcast or stream})
designates a channel for alerts for either streamers or new podcast notifications.

    - scaler    (+set scaler {channelName})
sets a voice channel to auto scale.

    - welcome  (+set welcome {message})
changes the default welcome message for new users to join.

+remove       (+remove {configuration})
removes one of the configruations by +set.
`;
        if (isAdmin) helpMessage += adminHelp;
        return message.channel.send(helpMessage);
      });
  },
};
