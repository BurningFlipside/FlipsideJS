var FlipsideAPIClass = process.env.FLIPSIDE_COV ? require('./lib-cov/FlipsideAPI') : require('./lib/FlipsideAPI');

//constants
module.exports.version = require('./package.json').version;

module.exports.FlipsideAPI = FlipsideAPIClass.FlipsideAPI;
