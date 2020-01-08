console.group('MyTestPrototype.js');
function addProto(...list) {
  return function(target) {
    Object.assign(target.prototype, ...list);
  };
}

const Foo = {
  foo() {
    console.log('foo');
  },
};

@addProto(Foo)
class MyClass {}
let obj = new MyClass();
obj.foo(); // 'foo'

console.groupEnd('MyTestPrototype.js');
