var expect = require('chai').expect;
var probe = require('../src/km.probe');

describe('km.probe', function () {
  it('should execute without error', function () {
    probe.handler({}, {}, function (error, result) {
      expect(error).to.be.null;
      expect(result).to.not.be.undefined;
    });
  });
});
