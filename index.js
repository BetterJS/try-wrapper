var acorn = require('acorn')
  , walk = require('acorn/util/walk')
  , escodegen = require('escodegen')
  , DEFAULT_CALLER = {
      type: 'BlockStatement',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'console'
              },
              property: {
                type: 'Identifier',
                name: 'error'
              },
              computed: false
            },
            arguments: [
              {
                type: 'Identifier',
                name: 'e'
              }
            ]
          }
        }
      ]
    };

function _parse(str) {
  var ast = acorn.parse(str);
  
  return {
    type: 'BlockStatement',
    body: ast.body
  };
}

module.exports = function (code, opt) {
  opt = opt || {};
  var ast, comments = [];
  try {
    ast = acorn.parse(code);
  } catch(e) {
    return;
  }
  walk.simple(ast, {
    // for FunctionDeclaration & FunctionExpression
    Function: function (node) {
      var body = node.body;
      node.body = {
        type: 'BlockStatement',
        body: [
          {
            type: 'TryStatement',
            block: body,
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              guard: null,
              body: opt.caller ?
                typeof opt.caller === 'Object' ?
                  opt.caller : _parse(opt.caller) :
                DEFAULT_CALLER
            },
            guardedHandlers: [],
            finalizer: null
          }
        ]
      };
    }
  });
  
  return escodegen.generate(ast, {
    format: {
      indent: {
        style: '    '
      }
    }
  });
};