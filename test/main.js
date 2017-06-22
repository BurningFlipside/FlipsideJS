var package = require('../package');
var flipside = require('../index');

module.exports.constants = function(assert) {
    assert.ok(typeof flipside.version == 'string');
    assert.done();
}

module.exports.noAuth = function(assert) {
    var api = new flipside.FlipsideAPI('https://profiles.burningflipside.com/api/v1');
    api.get({
      url: '/users',
      callback: function(data, err) {
        assert.ok(err);
        assert.equal(err.httpStatus, 401);
        assert.done();
      }
    });
}
