#!/usr/bin/env node
import dotenv from 'dotenv';
// import dotenvExpand from 'dotenv-expand';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { TOptions, getConfig, getEnvmodeReader } from './config';
import { mergeEnv } from './merge';
import { genrator } from './gen';
import { JsonToDotEnv } from './parser';
import dotenvExpand from './expand';
/**
 * HELPER
 */
const writeFileAsync = (filepath: string, content: string) => {
  fs.writeFileSync(filepath, content, { encoding: 'utf-8' });
};

const keyInProcessEnv = (x: string) => `ENVMODE_${x.toUpperCase()}`;

const mergeWithProcess = (opts: Record<string, string> = {}) => {
  /** 大多参数支持 ENVMODE_XXX  前缀来覆盖 --env.xxx 使用的配置 */
  const merged = Object.keys(opts).reduce((obj, key) => {
    const valInEnv = process.env[keyInProcessEnv(key)];
    obj[key] = valInEnv !== undefined ? valInEnv : opts[key];
    return obj;
  }, {} as TOptions);
  /** 只有 ENVMODE 最为常用, 直接简化为 ENVMODE, 并做覆盖 */
  merged.mode =
    process.env.ENVMODE !== undefined ? process.env.ENVMODE : opts.mode;
  return merged;
};

/**
 * CONFIG
 * 目前支持 ENVMODE=[mode], --env.mode=[mode], --env.dir=[envmode]
 */
const REG = {
  IS_ENV_ARG: /--env\./,
};

/**
 * 解析参数
 */

const argv = process.argv.splice(2);
const parserArgv = require('minimist')(argv);
const opts: TOptions = mergeWithProcess(parserArgv.env);
// 剩下的认为是用户命令
const cliargv = argv.filter((x) => !REG.IS_ENV_ARG.test(x));

/**
 * 获取配置
 */
const config = getConfig(opts);
const envmodeReader = getEnvmodeReader(config.dir);
const defaultEnv = envmodeReader('default');
const modeEnv = envmodeReader(opts.mode);
const mergedEnv = mergeEnv(defaultEnv, modeEnv);

/**
 * 第一次写入是为了给下面 dotenv 读取用
 *主要是 dotenv.parse 出来的对象不能直接给 dotenvExpand 用
 */
writeFileAsync(config.tmpDotEnv, mergedEnv);

const parsedEnv = dotenv.config({ path: config.tmpDotEnv });

// /** 这里其实已经注入进入 process.env 了 */
const { parsed: expandEnv } = dotenvExpand(parsedEnv);

/**
 * expand 之后再次写入, 给生成用
 */
writeFileAsync(config.tmpDotEnv, JsonToDotEnv(expandEnv));

genrator(config.tmpDotEnv, config.conf.genConfig);

if (
  process.env.NODE_ENV === 'development' ||
  process.env.ENVMODE_DEBUG !== undefined
) {
  console.log(
    '[envmode]-------------最终注入 process.env 环境变量---------------',
  );
  console.log(expandEnv);
}

/** 注入灵魂, 并跑剩下的命令 */
spawn(cliargv.join(' '), {
  shell: true,
  stdio: 'inherit',
});
