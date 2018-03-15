const Repeat = require('repeat');
const { evaluateStreams } = require('../services/evaluateStreamStatuses');

Repeat(evaluateStreams).every(40, 'seconds').start.now();
