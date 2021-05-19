module.exports = {
    extends: [
      //开启推荐规则
      "eslint:recommended",
      //插件开启vue规则
      "plugin:vue/essential"
    ],
    plugins: [
      "vue"
    ],
    env: {
      "jquery": true,
    },
    "globals": {
        "_": true,
        "jsPlumb":true,
        'require':true,
        'module':true,
        '__dirname':true,
        'webConfig':true
    },
      /**
       * 每个规则有【3】个错误级别。
       * off或0: 关闭该规则；
       * warn或1: 开启规则，使用警告级别的错误，不会导致程序退出；
       * error或2: 开启规则，使用错误级别的错误，当被触发的时候，程序会退出。
       */
    rules: { 
        //不禁止console
        'no-console': 0,
        //生产环境禁止debugger
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'curly': [1, 'all'],
        'default-case':1,
        //开括号前和闭括号后有空格
        'block-spacing': [0, 'always'],
        'no-unused-vars':1,
        'no-async-promise-executor': 0,
        'vue/no-unused-vars': 1,
        "no-extra-semi": 0,
        'vue/valid-v-for': 1,
        'vue/require-v-for-key':1,
        'vue/no-parsing-error':1,
        //允许v-model中使用filter或者表达式
        'vue/valid-v-model':0,
        'vue/no-unused-components':1,
        //空格和 tab 的混合缩进
        'no-mixed-spaces-and-tabs':1,
        'no-irregular-whitespace':0,
        'no-unreachable':1
    }
  }
  