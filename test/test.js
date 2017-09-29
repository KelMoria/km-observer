'use strict';

require('./support/setup.js');

var expect = require('chai').expect,
    should = require('chai').should(),
    sinon  = require('sinon'),
    nock   = require('nock'),
    Observer  = require('../src/km.observer');

const ENDPOINT         = 'http://mock.endpoint',
      SECURE_ENDPOINT  = 'https://mock.endpoint',
      COMPLEX_ENDPOINT = ENDPOINT + '/complex',
      SIMPLE_DATA      = require('./support/sample-data/simple.json'),
      COMPLEX_DATA     = require('./support/sample-data/complex.json');

var nock_http, nock_https, nock_complex;

describe('km.observer', function () {

  before(function () {
    nock_http = nock(ENDPOINT)
      .persist()
      .get('/')
      .reply(200, SIMPLE_DATA);

    nock_https = nock(SECURE_ENDPOINT)
      .persist()
      .get('/')
      .reply(200, SIMPLE_DATA);

    nock_complex = nock(ENDPOINT)
      .persist()
      .get('/complex')
      .reply(200, COMPLEX_DATA);
  });

  it('is constructed with an endpoint', function () {
    let observer = new Observer(ENDPOINT);
    return observer.endpoint.should.equal(ENDPOINT);
  });

  it('throws a TypeError when endpoint is not a string', function () {
    let emptyConstructor = () => { new Observer() };
    return emptyConstructor.should.throw(TypeError);
  });

  it('.deploy() returns a Promise', function () {
    let observer = new Observer(ENDPOINT);
    return observer.deploy().should.be.a('promise');
  });

  describe('can make requests via', function () {
    
    it('http', function () {
      let observer = new Observer(ENDPOINT);
      return observer.deploy().should.be.fulfilled;
    });

    it('https', function () {
      let observer = new Observer(SECURE_ENDPOINT);
      return observer.deploy().should.be.fulfilled;
    });

  });

  it('can handle complex data', function () {
    let observer = new Observer(COMPLEX_ENDPOINT);
    return observer.deploy().should.become(COMPLEX_DATA);
  });

  describe('formats resulting payload data', function () {

    it('raw, as-is (default)', function () {
      let observer = new Observer(ENDPOINT);
      return observer.deploy().should.become(SIMPLE_DATA);
    });

    it('to an optionally specified JSON format, recursively', function () {
      let observer = new Observer(COMPLEX_ENDPOINT, {
        'should-be-bar': 'foo',
        'should-be-true': 'foo-true',
        'should-be-false': 'foo-false',
        'should-be-7': 'foo-int',
        'should-be-3.141519': 'foo-float',
        'should-be-array': 'foo-array',
        'should-be-object': 'foo-object',
        'should-be-recursive': 'foo-recursive.recursive1.recursive2',
        'should-be-empty-string': 'foo-empty-string',
        'should-be-null': 'foo-null',
        'should-be-empty-array': 'foo-empty-array',
        'should-be-empty-object': 'foo-empty-object'
      });
      return observer.deploy().should.become({
        'should-be-bar': 'bar',
        'should-be-true': true,
        'should-be-false': false,
        'should-be-7': 7,
        'should-be-3.141519': 3.141519,
        'should-be-array': ['bar0', 'bar1', 'bar2'],
        'should-be-object': {'foo-object-foo': 'foo-object-bar'},
        'should-be-recursive': 'recursive3',
        'should-be-empty-string': '',
        'should-be-null': null,
        'should-be-empty-array': [],
        'should-be-empty-object': {}
      });
    });

    it('optionally allows raw input to be exposed to a new key', function () {
      let format = { 'should-be-bar': 'foo', 'should-be-raw-payload': 'raw' },
          observer  = new Observer(COMPLEX_ENDPOINT, format, 'raw');
      return observer.deploy().should.become({
        'should-be-bar': 'bar',
        'should-be-raw-payload': COMPLEX_DATA
      });
    });

  });
});
