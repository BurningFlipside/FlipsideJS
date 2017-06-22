var flipside = require('../index');

let apiKey = process.env.FLIPSIDE_API_KEY;

module.exports.apiKey = function(assert) {
    assert.ok(typeof apiKey === 'string');
    let profilesAPI = new flipside.ProfilesAPI('https://profiles.burningflipside.com/api/v1', apiKey);
    assert.ok(typeof profilesAPI === 'object');
    profilesAPI.getCurrentUser(function(user, err) {
      assert.ok(typeof user === 'object');
      assert.equal(user.uid, 'pboyd');
      assert.done();
    });
}

module.exports.testPhoto = function(assert) {
  let profilesAPI = new flipside.ProfilesAPI('https://profiles.burningflipside.com/api/v1', apiKey);
  profilesAPI.getCurrentUser(function(user, err) {
    user.getPhoto(function(photo, err) {
      assert.ok(photo);
      assert.done();
    });
  });
}

module.exports.testGroup = function(assert) {
  let profilesAPI = new flipside.ProfilesAPI('https://profiles.burningflipside.com/api/v1', apiKey);
  profilesAPI.getCurrentUser(function(user, err) {
    user.getGroups(function(groups, err) {
      assert.ok(groups);
      assert.ok(Array.isArray(groups));
      assert.done();
    });
  });
}
