require('@babel/register')({
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
});
require('./log.js');

require('./MyTestAble.js');
require('./MyTestAbleSort.js');
require('./MyTestParam.js');
require('./MyTestPrototype.js');
require('./readonly');
require('./HOC');
require('./Decorator');
