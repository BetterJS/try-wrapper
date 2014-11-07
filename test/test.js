var wrapper = require('../')
  , fs = require('fs');

console.log(wrapper(fs.readFileSync('./sample.js'), {
  caller: 'onthrow(e);'
}));