function FlipsideAPI(apiRoot, apiKey) {
  this.apiRoot = apiRoot;
  this.apiKey = null;
  if(apiKey !== undefined) {
    this.apiKey = apiKey;
  }
}

FlipsideAPI.prototype.rawRequest = function(options, callback) {
  if(options.headers === undefined) {
    options.headers = {};
  }
  if(typeof module === 'undefined') {
    $.ajax({
      url: options.url,
      type: options.type,
      dataType: 'json',
      headers: options.headers,
      complete: callback});
  }
  else {
    var request = require('request');
    request({
      url: options.url,
      method: options.type,
      headers: options.headers,
    }, callback);
  }
}

FlipsideAPI.prototype.request = function(options) {
  options.headers = {};
  if(this.apiKey !== null) {
    options.headers['Authorization'] = 'ApiKey '+this.apiKey;
  }
  if(options.api === undefined) {
    options.api = this;
  }
  options.url = this.apiRoot+options.url;
  var callback = apiCallbackBrowser.bind(options);
  if(typeof module !== 'undefined') {
    callback = apiCallbackRequest.bind(options);
  }
  this.rawRequest(options, callback);
}

FlipsideAPI.prototype.get = function(options) {
  options.type = 'get';
  this.request(options);
}

FlipsideAPI.prototype.post = function(options) {
  options.type = 'post';
  if(options.data === undefined) {
    options.data = '';
  }
  this.request(options);
}

FlipsideAPI.prototype.patch = function(options) {
  options.type = 'patch';
  if(options.data === undefined) {
    options.data = '';
  }
  this.request(options);
}

FlipsideAPI.prototype.delete = function(options) {
  options.type = 'delete';
  this.request(options);
}

function apiCallbackBrowser(jqXHR) {
  if(this.callback === undefined) {
    return;
  }
  if(jqXHR.status === 200) {
    if(this.objectType !== undefined) {
      if(Array.isArray(jqXHR.responseJSON)) {
        for(var i = 0; i < jqXHR.responseJSON.length; i++) {
          jqXHR.responseJSON[i] = new this.objectType(jqXHR.responseJSON[i], this.ticketSystem);
        }
      }
      else {
        jqXHR.responseJSON = new this.objectType(jqXHR.responseJSON, this.api);
      }
    }
    if(this.parser === undefined) {
      this.callback(jqXHR.responseJSON, null);
    }
    else {
      this.parser(jqXHR.responseJSON, this.callback);
    }
  }
  else {
    var err = {
      httpStatus: jqXHR.status,
      jsonResp: jqXHR.responseJSON,
      textResp: jqXHR.responseText};
    this.callback(null, err);
  }
}

function apiCallbackRequest(error, response, body) {
  if(this.callback === undefined) {
    return;
  }
  if(response.statusCode === 200) {
    let json = false;
    try {
      json = JSON.parse(body);
    }
    catch(e) {
      var err = {
        httpStatus: response.statusCode,
        textResp: body};
      this.callback(null, err);
    }
    if(this.objectType !== undefined) {
      if(Array.isArray(json)) {
        for(var i = 0; i < json.length; i++) {
          json[i] = new this.objectType(json[i], this.api);
        }
      }
      else {
        json = new this.objectType(json, this.api);
      }
    }
    if(this.parser === undefined) {
      this.callback(json, null);
    }
    else {
      this.parser(json, this.callback);
    }
  }
  else {
    let json = undefined;
    try {
      json = JSON.parse(body);
    }
    catch(e) {}
    var err = {
      httpStatus: response.statusCode,
      jsonResp: json,
      textResp: body};
    this.callback(null, err);
  }
}

if(typeof module !== 'undefined') {
  module.exports.FlipsideAPI = FlipsideAPI;
}
/* vim: set tabstop=2 shiftwidth=2 expandtab: */
