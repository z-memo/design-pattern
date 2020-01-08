console.group('MyTestParam.js');
function testable(isTestable) {
  return function(target) {
    target.isTestable = isTestable;
  };
}

@testable(true)
class MyTest {}
console.log(MyTest.isTestable); // true

@testable(false)
class MyClass {}
console.log(MyClass.isTestable); // false

console.groupEnd('MyTestParam.js');
