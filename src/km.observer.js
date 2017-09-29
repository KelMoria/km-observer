'use strict';

var needle = require('needle');

class Observer {
  constructor(endpoint, format, raw) {
    if (typeof endpoint !== 'string') {
      throw new TypeError(`Endpoint must be a string. Got ${endpoint}`);
    }
    this.endpoint = endpoint;
    this.format = format;
    this.raw = raw;
  }

  deploy() {
    return new Promise((resolve, reject) => {
      if (this.endpoint) {
        needle('get', this.endpoint)
          .then(this._resolve(resolve, reject))
          .catch(error => reject(error));
      }
    });
  }

  _resolve(resolve, reject) {
    return (response) => {
      if (response.statusCode == 200) {
        if (this.format) {
            resolve(this._format(response.body));
          } else {
            resolve(response.body);
          }
      } else {
        reject({error: response.statusCode, response: response});
      }
    }
  }

  _format(data) {
    let payload = {}, key;
    for (key in this.format) {
      if (this.format[key] == this.raw) {
        payload[key] = data;
      } else {
        payload[key] = this._deepest(this.format[key].split('.'), data);
      }
    }
    return payload;
  }

  _deepest(r_keys, haystack) {
    let spliced = [];
    if (r_keys.length == 1) {
      return haystack[r_keys[0]];
    } else {
      spliced = r_keys.splice(0,1);
      return this._deepest(r_keys, haystack[spliced[0]]);
    }
  }
}

module.exports = Observer;
