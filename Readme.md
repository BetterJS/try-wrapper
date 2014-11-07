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

Advanced Example
----------------

> 仅对特定函数进行包裹。

```javascript
var wrapper = require('try-wrapper');

function _nameFilter() {
    // 表示仅对setTimeout, setInterval, jQuery.ajax, 
    // $.ajax, require, define中的函数进行包裹
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

console.log(
    wrapper(/* 你的源代码 */, {
        nameFilter: _nameFilter
    })
);
```

下面是源代码和输出的对照：

* setTimeout

源代码

```
setTimeout(function () {
    console.log('hello world!');
}, 1000);
```

输出

```
setTimeout(function () {
    try {
        console.log('hello world!');
    } catch (e) {
        console.error(e);
    }
}, 1000);
```

* $.ajax

源代码

```
$.ajax({
    type: 'POST',
    complete: function () {
        console.log('done');
    },
    error: function () {
        console.log('error');
    }
})
```

输出

```
$.ajax({
    type: 'POST',
    complete: function () {
        try {
            console.log('done');
        } catch (e) {
            console.error(e);
        }
    },
    error: function () {
        try {
            console.log('error');
        } catch (e) {
            console.error(e);
        }
    }
});
```

* 不需要包裹的函数

源代码

```
unnecssary('test', function () {
    console.log('unnecssary');
});
```

输出

```
unnecssary('test', function () {
    console.log('unnecssary');
});
```