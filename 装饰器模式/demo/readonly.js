console.group('readonly.js');
class Person {
  @readonly
  name = 'first';

  @readonly
  destroyRobots() {
    return 'destroyRobots';
  }
}

function readonly(target, name, descriptor) {
  // descriptor对象原来的值如下
  // {
  //   value: specifiedFunction,
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };
  descriptor.writable = false;
  return descriptor;
}

const person = new Person();
console.log('Person name----', person.name); // first
person.name = 'second';
console.log('Person name writable----', person.name); // first
console.log('destroyRobots----', person.destroyRobots()); // destroyRobots
person.destroyRobots = () => "I can't do this";
console.log('destroyRobots writable---', person.destroyRobots()); // destroyRobots
console.groupEnd('readonly.js');
// readonly(Person.prototype, 'name', descriptor);
// // 类似于
// Object.defineProperty(Person.prototype, 'name', descriptor);
