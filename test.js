const repeat = require('repeat');

function print () {
  console.log('hi');
}

repeat(print).every(20, 's').start.now();
