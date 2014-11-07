var wrapper = require('../');

console.log(
    wrapper('function test() { console.log("hello world"); }', { caller: 'onthrow(e);' })
);