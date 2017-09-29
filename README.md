# km-observer
Consumes and formats public REST API method payloads

## Requirements
* [Node](https://github.com/nodejs/node) >=6.10.3 (to target AWS Lambda)

## Install
`npm install`

## Usage
```javascript
const Observer = require('km.observer');

let observer = new Observer('http://example.com/sample.json');

observer.deploy.then(payload => console.log(payload));
```
### Custom Output Format
```javascript
// sample.json
{ "foo": "bar" }
```
```javascript
let observer = new Observer('http://example.com/sample.json', { 'should-be-bar': 'foo' });

observer.deploy().then(payload => console.log(payload));
```
```javascript
{ 'should-be-bar': 'bar' }
```
This also works recursively
```javascript
// complex.json
{ "recursive": { "foo" : { "foo": "bar" } } }
```
```javascript
let format = { 'should-be-bar': 'recursive.foo.foo' },
    observer = new Observer('http://example.com/complex.json', format);
    
observer.deploy().then(payload => console.log(payload));
```
```javascript
{ 'should-be-bar': 'bar' }
```
Optionally, you can expose the raw payload with a custom output format
```javascript
let format = { 'should-be-bar': 'foo', 'should-be-raw': 'raw' },
    observer = new Observer('http://example.com/sample.json', format, 'raw');
    
observer.deploy().then(payload => console.log(payload));
```
```javascript
{ 'should-be-bar': 'bar', 'should-be-raw': { "foo": "bar" } }
```
## Test
`npm test`

## Dependencies
* [Needle](https://github.com/tomas/needle)

## Development Dependencies
* [Chai](https://github.com/chaijs/chai)
* [Chai as Promised](https://github.com/domenic/chai-as-promised)
* [Mocha](https://github.com/mochajs/mocha)
* [Nock](https://github.com/node-nock/nock)
* [Sinon](https://github.com/sinonjs/sinon)