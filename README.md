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
│   ├── .env.3
│   ├── .env.default
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
 config: {
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

## 规则

- 如果存在 .env.default 那么会进行 merge, 最终结果为 .env.default + .env.{mode}, merge 逻辑为同名覆盖

- 优先级 ENVMODE > --env.mode

- 后面如果有 *&&* | *&* 连接的命令, 参考上面 `okcross` 使用 npm 进行一次包装, thanks to [@JserWang](https://github.com/JserWang)


## inspired

by [vite](https://vitejs.dev/) and [motdotla/dotenv](https://github.com/motdotla/dotenv)
