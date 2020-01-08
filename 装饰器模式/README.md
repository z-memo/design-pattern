# 装饰器模式

## 背景

在 ES6 中增加了对类对象的相关定义和操作（比如 `class` 和 `extends` ），这就使得我们在多个不同类之间共享或者扩展一些方法或者行为的时候，变得并不是那么优雅。这个时候，我们就需要一种更优雅的方法来帮助我们完成这些事情。

## 概述

`装饰器模式（Decorator）`: 在不改变对象自身的基础上，动态的给某个对象添加新的功能，同时又不改变其接口

> 装饰器模式属于结构型模式。

`JS`中的`Decorator`在原理和功能上简单明了，简而言之就是对对象进行包装，返回一个新的对象描述`（descriptor）`。这个概念其实和`React`中的高阶组件也类似，大家可以用高阶组件的方式来理解它。

## 初探

[准备工作](./init.md)

假设我们现在要对一个函数 log，打印出它的执行记录。

不使用`Decorator`

```javascript
const log = srcFunc => {
  if (typeof srcFunc !== 'function') {
    throw new Error('请传一个函数');
  }
  return (...args) => {
    console.log(`函数${srcFunc.name}调用的参数为：`, args.join(','));
    srcFunc(...args);
  };
};

const plus = (a, b) => a + b;
const logPlus = log(plus);
logPlus(1, 2); // 函数plus调用的参数为： 1,2
```

使用`Decorator`

```js
const logDecorator = (target, name, descriptor) => {
  const oldValue = descriptor.value;
  descriptor.value = function() {
    console.log(`函数${name}参数为：`, arguments);
    return oldValue.apply(this, arguments);
  };
  return descriptor;
};

class Math {
  @logDecorator // Decorator
  plus(a, b) {
    return a + b;
  }
}
const math = new Math(); // 函数plus参数为：{ '0': 1, '1': 2 }

math.plus(1, 2);
```

从上面的代码可以看出，如果有的时候我们并不需要关心函数的内部实现，仅仅是想调用它的话，装饰器能够带来比较好的可读性，使用起来也是非常的方便。

## 用法

### 类的装饰

```javascript
@testable
class MyTestAble {}

function testable(target) {
  target.isTestable = true;
}

console.log(MyTestAble.isTestable); // true
```

上面代码中，`@testable` 就是一个装饰器。它修改了 `MyTestAble`这 个类的行为，为它加上了静态属性`isTestable`。`testable` 函数的参数 `target` 是 `MyTestAble` 类本身。

基本上，装饰器的行为就是下面这样。

```
@decorator
class A {}

// 等同于

class A {}
A = decorator(A) || A;
```

也就是说，**装饰器是一个对类进行处理的函数。装饰器函数的第一个参数，就是所要装饰的目标类。**

如果觉得一个参数不够用，可以在装饰器外面再封装一层函数。

```javascript
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
```

上面代码中，装饰器 `testable` 可以接受参数，这就等于可以修改装饰器的行为。

注意，**装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。** 这意味着，装饰器能在编译阶段运行代码。也就是说，**装饰器本质就是编译时执行的函数。**

前面的例子是为类添加一个静态属性，如果想添加实例属性，可以通过目标类的 `prototype` 对象操作。

```javascript
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
```

### 方法的装饰

装饰器不仅可以装饰类，还可以装饰类的属性。

```javascript
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
```

装饰器函数 `readonly` 一共可以接受三个参数。

- 装饰器第一个参数是 类的原型对象，上例是 `Person.prototype`，装饰器的本意是要“装饰”类的实例，但是这个时候实例还没生成，所以只能去装饰原型（这不同于类的装饰，那种情况时`target`参数指的是类本身）；
- 第二个参数是 所要装饰的属性名
- 第三个参数是 该属性的描述对象 [`descriptor`](#扩展)

### 函数方法的装饰

!!! 装饰器只能用于类和类的方法，不能用于函数，因为存在函数提升。

另一方面，如果一定要装饰函数，可以采用高阶函数的形式直接执行。

```javascript
function doSomething(name) {
  console.log('Hello, ' + name);
}

function loggingDecorator(wrapped) {
  return function() {
    console.log('Starting');
    const result = wrapped.apply(this, arguments);
    console.log('Finished');
    return result;
  };
}

const wrapped = loggingDecorator(doSomething);

wrapped('world');
// Starting
// Hello, world
// Finished
```

## Decorator 的兼容性

目前 ES 中`Decorator`还处于提案阶段,各大浏览器和`node`,均未公开支持这一特性.如果想要使用,则需要借用`babel`的一个插件`@babel/plugin-proposal-decorators`才可以.

## 总结

装饰器使得组合函数的功能变得容易，也用简洁的语法提高了代码可读性

优点

- 装饰类和被装饰类都只关心自身的核心业务，实现了解耦。
- 方便动态的扩展功能，且提供了比继承更多的灵活性。

缺点

- 如果功能扩展过多，势必产生大量的类。
- 多层装饰比较复杂。

## 扩展～

JS 中的装饰器本质也是一个函数，依赖于 `ES5` 的 `Object.defineProperty` 方法，利用的是 JS 中`object`的`descriptor`，这个函数会接收三个参数:

```javascript
/**
 * @desc 装饰器函数
 * @param {Object} target 被装饰器的类的原型
 * @param {string} name 被装饰的类、属性、方法的名字
 * @param {Object} descriptor 被装饰的类、属性、方法的descriptor
 */
function Decorator(target, name, descriptor) {
  // 以此可以获取实例化的时候此属性的默认值
  let v = descriptor.initializer && descriptor.initializer.call(this);

  // 返回一个新的描述对象作为被修饰对象的descriptor，或者直接修改 descriptor 也可以
  return {
    enumerable: true,
    configurable: true,
    get() {
      return v;
    },
    set(c) {
      v = c;
    },
  };
}
```

可参考[Object.defineProperty](./defineProperty.md)

## 参考链接

- [JavaScript 设计模式总结](https://juejin.im/post/5c984610e51d45656702a785)
- [设计模式——装饰器模式](https://juejin.im/post/5add8e9cf265da0b9d77d377)
- [装饰器](http://es6.ruanyifeng.com/#docs/decorator)
