var name = 'myObject';
var val = 'majorKey';
var obj = {};
var ary = [];

obj[name] = val;

ary.push(obj);

console.log(Object.keys(obj));