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

function _getCalleeName(node) {
  if (node.type === 'MemberExpression') {
    var name;
    walk.simple(node, {
      'MemberExpression': function (node) {
        if (!name) name = node.object.name;
        name += '.' + node.property.name;
      }
    })
    return name;
  } else if (node.type === 'Identifier') {
    return node.name;
  }
}

function _check(ancestors, nameFilter) {
  var i = ancestors.length - 2;
  switch (ancestors[i].type) {
    /* 
     * a({ 
     *    b: function () {
     *     // for this type function  
     *    } 
     * });
     */
    case 'Property':
      if (
        ancestors[--i].type === 'ObjectExpression' &&
          ancestors[--i].type === 'CallExpression'
      ) {
        return nameFilter(_getCalleeName(ancestors[i].callee));
      }
      break;
    /* 
     * a(function () {
     *   // for this type function  
     * });
     */
    case 'CallExpression':
      return nameFilter(_getCalleeName(ancestors[i].callee));
  }
  return true;
}

module.exports = function (code, opt) {
  opt = opt || {};
  var ast, nameFilter = opt.nameFilter || null
    , ignoreDelcaration = opt.ignoreDelcaration || false;
  try {
    ast = acorn.parse(code);
  } catch(e) {
    return;
  }
  walk.ancestor(ast, {
    // for FunctionDeclaration & FunctionExpression
    Function: function (node, ancestors) {
      if (node.type === 'FunctionExpression' && nameFilter && !_check(ancestors, nameFilter)) return;
      if (node.type === 'FunctionDeclaration' && ignoreDelcaration) return;
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