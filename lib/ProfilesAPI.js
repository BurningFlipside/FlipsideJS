if(typeof module !== 'undefined') {
  var FlipsideAPI = require('./FlipsideAPI');
  var CryptoJS = require('crypto-js');
}

function ProfilesAPI(apiRoot, apiKey) {
  this.apiRoot = 'https://profiles.burningflipside.com/api/v1';
  if(apiRoot !== undefined) {
    this.apiRoot = apiRoot;
  }
  this.apiKey = null;
  if(apiKey !== undefined) {
    this.apiKey = apiKey;
  }
  this.FlipsideAPI = new FlipsideAPI.FlipsideAPI(this.apiRoot, this.apiKey);
  this.FlipsideAPI.Profiles = this;
}

function FlipsideUser(data, api) {
  this.api = api;
  for(var propName in data) {
    this[propName] = data[propName];
  }
}

function FlipsideGroup(data, api) {
  this.api = api;
  for(var propName in data) {
    this[propName] = data[propName];
  }
}

ProfilesAPI.prototype.getCurrentUser = function(callback) {
  this.getUserByName('me', callback);
}

ProfilesAPI.prototype.getUserByName = function(name, callback) {
  this.FlipsideAPI.get({url: '/users/'+name, callback: callback, objectType: FlipsideUser});
}

ProfilesAPI.prototype.getGroupsForUser = function(uid, callback) {
  this.FlipsideAPI.get({url: '/users/'+uid+'/groups', callback: callback, objectType: FlipsideGroup});
}

FlipsideUser.prototype.getPhoto = function(callback) {
  if(this.jpegPhoto !== '') {
    callback(this.jpegPhoto, null);
  }
  else {
    this.api.rawRequest({type: 'get', 
      url: 'https://www.gravatar.com/avatar/'+CryptoJS.MD5(this.mail.toLowerCase())+'?d=identicon'}, function(arg1, arg2, arg3) {
      if(arg1 && arg1.responseText !== undefined) {
        this.jpegPhoto = arg1.responseText;
        callback(this.jpegPhoto, null);
      }
      else if(arg3 !== undefined) {
        this.jpegPhoto = arg3;
        callback(this.jpegPhoto, null);
      }
      else if(arg1.status !== undefined) {
        callback(null, {httpStatus: arg1.status});
      }
      else {
        callback(null, {httpStatus: arg2.statusCode});
      }
    });
  }
}

FlipsideUser.prototype.getGroups = function(callback) {
  this.api.Profiles.getGroupsForUser(this.uid, callback);
}

if(typeof module !== 'undefined') {
  module.exports.ProfilesAPI = ProfilesAPI;
}
