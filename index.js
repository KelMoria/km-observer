'use strict';

var Observer = require('./lib/km.observer');

module.exports = Observer;

var observer = new Observer('https://api.gdax.com/products/eth-usd/ticker');
