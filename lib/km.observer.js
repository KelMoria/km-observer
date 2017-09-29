'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var needle = require('needle');

var Observer = function () {
  function Observer(endpoint, format, raw) {
    _classCallCheck(this, Observer);

    if (typeof endpoint !== 'string') {
      throw new TypeError('Endpoint must be a string. Got ' + endpoint);
    }
    this.endpoint = endpoint;
    this.format = format;
    this.raw = raw;
  }

  _createClass(Observer, [{
    key: 'deploy',
    value: function deploy() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (_this.endpoint) {
          needle('get', _this.endpoint).then(_this._resolve(resolve, reject)).catch(function (error) {
            return reject(error);
          });
        }
      });
    }
  }, {
    key: '_resolve',
    value: function _resolve(resolve, reject) {
      var _this2 = this;

      return function (response) {
        if (response.statusCode == 200) {
          if (_this2.format) {
            resolve(_this2._format(response.body));
          } else {
            resolve(response.body);
          }
        } else {
          reject({ error: response.statusCode, response: response });
        }
      };
    }
  }, {
    key: '_format',
    value: function _format(data) {
      var payload = {},
          key = void 0;
      for (key in this.format) {
        if (this.format[key] == this.raw) {
          payload[key] = data;
        } else {
          payload[key] = this._deepest(this.format[key].split('.'), data);
        }
      }
      return payload;
    }
  }, {
    key: '_deepest',
    value: function _deepest(r_keys, haystack) {
      var spliced = [];
      if (r_keys.length == 1) {
        return haystack[r_keys[0]];
      } else {
        spliced = r_keys.splice(0, 1);
        return this._deepest(r_keys, haystack[spliced[0]]);
      }
    }
  }]);

  return Observer;
}();

module.exports = Observer;