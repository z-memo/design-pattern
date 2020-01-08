console.group('Decorator.js');
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

// USE
class Fudao {
  @Decorator
  title = '企鹅辅导';
}

// decorator 外部可以包装一个函数，函数可以带参数
function DecoratorParam(type) {
  /**
   * 装饰器函数
   * @param {Object} target 被装饰器的类的原型
   * @param {string} name 被装饰的类、属性、方法的名字
   * @param {Object} descriptor 被装饰的类、属性、方法的descriptor
   */
  return (target, name, descriptor) => {
    // 以此可以获取实例化的时候此属性的默认值
    let v = descriptor.initializer && descriptor.initializer.call(this);

    // 返回一个新的描述对象作为被修饰对象的descriptor，或者直接修改 descriptor 也可以
    return {
      enumerable: true,
      configurable: true,
      get() {
        return v + type;
      },
      set(c) {
        v = c;
      },
    };
  };
}

// USE
class Fudao2 {
  @DecoratorParam('string')
  title = '企鹅辅导';
}
const result = new Fudao();

console.log(result.title);
console.groupEnd('Decorator.js');
