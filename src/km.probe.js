'use strict';

var needle = require('needle');

class Probe {
  constructor(endpoint) {
    if (typeof endpoint !== 'string') {
      throw new TypeError(`Endpoint must be a string. Got ${endpoint}`);
    }
    this.endpoint = endpoint;
  }

  deploy() {
    return new Promise((resolve, reject) => {
      if (this.endpoint) {
        needle.get(this.endpoint, this._resolve(resolve, reject));
      }
    });
  }

  _resolve(resolve, reject) {
    return (error, response) => {
      if (!error && response.statusCode == 200) {
        resolve(response.body);
      } else {
        reject(error);
      }
    }
  }
}

module.exports = Probe;
