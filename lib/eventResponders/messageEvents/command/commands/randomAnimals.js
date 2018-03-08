const { cat, dog } = require('random-animal');

module.exports = {
  cat ({ message }) {
    cat()
      .then(url => message.reply({ file: url }));
  },

  dog ({ message }) {
    dog()
      .then(url => message.reply({ file: url }));
  },
};
