# envmode

cli tools to load dotenv with expand by ENVMODE | --env.mode.

## 准备工作

> .env.{mode} [example](https://github.com/charlzyx/envmode/tree/master/example)

```
./project
├── envmode
│   ├── .env
│   ├── .env.1
│   ├── .env.2
│   └── config.js
├── package.json
├── test.js
└── test2.lock
```

## 使用

```sh
npm install envmode
# or
yarn add envmode
```

之后

```json
{
  "scripts": {
    "testall": "npm run badcross && npm run okcross && npm run test1 && npm run test2 && npm run test3",
    "badcross": "ENVMODE=1 envmode node test.js && node test2.js",
    "okcross": "ENVMODE=1 envmode npm run mulcli",
    "mulcli": "node test.js && node test2.js",
    "test1": "ENVMODE=1 envmode node test.js",
    "test2": "envmode --env.mode=2 node test.js",
    "test3": "ENVMODE=1 envmode --env.mode=2 node test.js"
  }
}
```

## 文件生成

```js
// envmode/config.js
/**
type TConfig = {
    genConfig: {
      genEnvJsFilePaths?: string | string[]
      genEnvTsFilePaths?: string | string[]
      genEnvDefinesFilePaths?: string | string[]
      genProcessTypeDefinesPaths?: string | string[]
    }
 }
 */
const path = require('path');

const cwd = (file) => path.resolve(process.cwd(), file);

module.exports = {
  genConfig: {
    genEnvJsFilePaths: cwd('./env.js'),
    genEnvDefinesFilePaths: cwd('./defines.js'),
    genEnvTsFilePaths: [cwd('./web/ENV.ts'), cwd('./src/ENV.ts')],
    genProcessTypeDefinesPaths: cwd('./typings/process.d.ts'),
  },
};
```

## expand 规则
```bash
# 在 process.env 中已经存在的值,
# 会被替换为 process.env.VAR_EXIST_IN_PROCESS_ENV 的值
# 相当于copy了一下 process.env 的值
# 多用于生成 ENV.ts 使用
VAR_EXIST_IN_PROCESS_ENV=${VAR_EXIST_IN_PROCESS_ENV}
VAR_EXIST_IN_PROCESS_ENV=$VAR_EXIST_IN_PROCESS_ENV
# 在 process.env 中不存在!!!的值
# 会被替换为 '', 这是跟 dotenv-expand 区别的地方
# 在 dotenv-expand 中, 会 递归 maxsize error
VAR_NOT_EXIST_IN_PROCESS_ENV=${VAR_NOT_EXIST_IN_PROCESS_ENV}
VAR_NOT_EXIST_IN_PROCESS_ENV=$VAR_NOT_EXIST_IN_PROCESS_ENV
```

## 规则

- .env 为默认变量表
- 指定 --env.mode=[mode] 之后如果存在 .env.[mode] 那么会进行 merge, 最终结果为 .env + .env.{mode}, merge 逻辑为同名覆盖
- 优先级 ENVMODE > --env.mode
- 后面如果有 *&&* | *&* 连接的命令, 参考上面 `okcross` 使用 npm 进行一次包装, thanks to [@JserWang](https://github.com/JserWang)

## debug
```js
if (
  process.env.NODE_ENV === 'development' ||
  process.env.ENVMODE_DEBUG !== undefined
) {
  console.log(
    '[envmode]-------------最终注入 process.env 环境变量---------------',
  );
  console.log(expandEnv);
}
```


## inspired

by [vite](https://vitejs.dev/) and powered by [motdotla/dotenv](https://github.com/motdotla/dotenv)
