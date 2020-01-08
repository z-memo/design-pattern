console.group('MyTestAbleSort.js');

@testable2
@testable1
class MyTestAble {}

function testable2(target) {
  console.log('2');
  target.isTestable = 'testable2';
}

function testable1(target) {
  console.log('1');
  target.isTestable = 'testable1';
}
console.log('result', MyTestAble.isTestable); // true

console.groupEnd('MyTestAbleSort.js');
