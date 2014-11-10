var wrapper = require('../')
  , fs = require('fs');

function shouldEqual(caseName, opt) {
  wrapper(
    fs.readFileSync(__dirname + '/src/' + caseName + '.js', 'utf-8'),
    opt
  ).should.equal(
    fs.readFileSync(__dirname + '/expect/' + caseName + '.js', 'utf-8')
  );
}

function nameFilter(name) {
  var matchs = {
    'setTimeout': true,
    'setInterval': true,
    'jQuery.ajax': true,
    '$.ajax': true,
    'require': true,
    'define': true
  }
  return matchs[name];
}

describe('try-wrapper', function () {
  it('should able to wrap a function', function () {
    shouldEqual('namedFunction');
  });

  it('should able to wrap a anonymous function', function () {
    shouldEqual('anonFunction');
  });

  it('should able to wrap a setTimeout function', function () {
    shouldEqual('timeoutFunction');
  });

  it('should able to wrap $.ajax', function () {
    shouldEqual('jQueryAjax')
  });

  it('should able to wrap a function which in another function', function () {
    shouldEqual('insideFunction');
  });

  it('should able to filter out unnecessary fucntions', function () {
    shouldEqual('timeoutFunction', { nameFilter: nameFilter });
    shouldEqual('jQueryAjax', { nameFilter: nameFilter });
    shouldEqual('unnecessary', { nameFilter: nameFilter });
    shouldEqual('unnecessary2', { nameFilter: nameFilter });
  });

  it('should able to ignore function declaration', function () {
    shouldEqual('ignoreDelcaration', { ignoreDelcaration: true });
  })
});