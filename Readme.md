try-wrapper
===========

> 输入Javascript脚本字符串，然后利用try catch将其包裹起来，基于构建的前端错误捕获工具。

Example 1
---------

```javascript
var wrapper = require('try-wrapper');

console.log(
    wrapper('function test() { console.log("hello world"); }')
);
```

结果：

```
function test() {
    try {
        console.log('hello world');
    } catch (e) {
        console.error(e);
    }
}
```

Example 2
---------

```javascript
var wrapper = require('try-wrapper');

console.log(
    wrapper('function test() { console.log("hello world"); }', { caller: 'onthrow(e);' })
);
```

结果：

```
function test() {
    try {
        console.log('hello world');
    } catch (e) {
        onthrow(e);
    }
}
```

