'use strict';
require('./support/setup.js');
const expect = require('chai').expect;
const should = require('chai').should();
const sinon = require('sinon');
const nock = require('nock');
const Probe = require('../src/km.probe');

const ENDPOINT = 'http://mock.endpoint';
const SECURE_ENDPOINT = 'https://mock.endpoint';
const MOCK_PAYLOAD = [{ foo: 'bar' }];

var nock_http, nock_https;

describe('km.probe', function () {
  before(function () {
    nock_http = nock(ENDPOINT)
      .persist()
      .get('/')
      .reply(200, MOCK_PAYLOAD);
    nock_https = nock(SECURE_ENDPOINT)
      .persist()
      .get('/')
      .reply(200, MOCK_PAYLOAD);
  });
  it('is constructed with an endpoint', function () {
    let probe = new Probe(ENDPOINT);
    return probe.endpoint.should.equal(ENDPOINT);
  });
  it('throws a TypeError when endpoint is not a string', function () {
    let emptyConstructor = () => { new Probe() };
    return emptyConstructor.should.throw(TypeError);
  });
  it('.deploy() returns a Promise', function () {
    let probe = new Probe(ENDPOINT);
    return probe.deploy().should.be.a('promise');
  });
  describe('can make requests via', function () {
    it('http', function () {
      let probe = new Probe(ENDPOINT);
      return probe.deploy().should.be.fulfilled;
    });
    it('https', function () {
      let probe = new Probe(SECURE_ENDPOINT);
      return probe.deploy().should.be.fulfilled;
    });
  });
  describe('formats resulting payload data', function () {
    it('raw, as-is (default)', function () {
      let probe = new Probe(ENDPOINT);
      return probe.deploy().should.become(MOCK_PAYLOAD);
    });
  });
});
