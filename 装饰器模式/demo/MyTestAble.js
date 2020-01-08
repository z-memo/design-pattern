console.group('MyTestAble.js');
@testable
class MyTestAble {}

function testable(target) {
  target.isTestable = true;
}

console.log(MyTestAble.isTestable); // true

console.groupEnd('MyTestAble.js');
