const Repeat = require('repeat');
const { evaluateStreams } = require('../services/evaluateStreamStatuses');

Repeat(evaluateStreams).every(90, 'seconds').start.now();
