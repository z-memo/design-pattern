console.group('log.js');
// 不使用Decorator
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

// 使用Decorator
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

console.groupEnd('log.js');
