var FlipsideAPIClass = process.env.FLIPSIDE_COV ? require('./lib-cov/FlipsideAPI') : require('./lib/FlipsideAPI');
var ProfileAPIClass = process.env.FLIPSIDE_COV ? require('./lib-cov/ProfilesAPI') : require('./lib/ProfilesAPI');

//constants
module.exports.version = require('./package.json').version;

module.exports.FlipsideAPI = FlipsideAPIClass.FlipsideAPI;
module.exports.ProfilesAPI = ProfileAPIClass.ProfilesAPI;
