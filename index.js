'use strict';

var Observer = require('./lib/km.observer');

module.exports = Observer;

var observer = new Observer('https://api.gdax.com/products/products/eth-usd/ticker');
observer.deploy().then(result => {
  console.log('result', result);
}).catch(reject => {
  console.log('reject', reject);
});
