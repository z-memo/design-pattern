# 装饰器模式

## 基本工作

1. 安装插件

   ```
   $ yarn add -D @babel/register @babel/plugin-proposal-decorators @babel/core
   ```

1. 创建`index.js`

   ```js
   require('@babel/register')({
     plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
   });
   require('./log.js');
   ```

1. 创建`log.js`

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

1. 执行`node index.js`

   ```

   log：使用了修饰器的js
   index：用来编译log
   node：执行编译器index

   原理：
   1，node执行index.js文件；
   2，index文件改写了node的require方法；
   3，index在引用log.js，使用了新的require方法；
   4，log.js在加载过程中被编译，并执行。

   好处：
   1，命令行无多余操作，与node集成了。
   2，不用显式的创建.babelrc。

   缺点：
   1.同步编译，生产环境会有性能问题
   因为不是真正输出，所以如果要使用具有修饰器的.js文件，每次都需要编译。
   ```
