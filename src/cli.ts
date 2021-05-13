#!/usr/bin/env node
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { getConfig, getEnvmodeReader } from './config';
import { mergeEnv } from './merge';
import { genrator } from './gen';
import { JsonToDotEnv } from './parser'


const writeFileAsync = (filepath: string, content: string) => {
  fs.writeFileSync(filepath, content, { encoding: 'utf-8'});
}

const argv = process.argv.splice(2);
const ENVMODE_PATTERN = /--env\./

const parserArgv = require('minimist')(argv);

const envmodeArg = parserArgv.env || {};

/** 保留给自己用的一些配置 */
const ENVMODE_RAW_ARGS = argv.filter(x => ENVMODE_PATTERN.test(x));


const ENVMODE = process.env.ENVMODE || envmodeArg.mode || '';

/** 后面要执行的命令 */
const OTHER_RAW_ARGS = argv.filter(x => !ENVMODE_PATTERN.test(x));

/** 获取配置 */
const config = getConfig(ENVMODE_RAW_ARGS);

const DOTENV_OUTPUT = path.resolve(config.envmodeDir, './.env');
/** 读取 default */

const envmodeReader = getEnvmodeReader(config.envmodeDir);

const defaultENV = envmodeReader('default');

const modeENV = envmodeReader(ENVMODE);

const mergedENV = mergeEnv(defaultENV, modeENV);

/**
 * 第一次写入是为了给下面 dotenv 读取用
 *主要是 dotenv.parse 出来的对象不能直接给 dotenvExpand 用
 */
writeFileAsync(DOTENV_OUTPUT, mergedENV);

const myEnv = dotenv.config({ path: DOTENV_OUTPUT });

/** 这里其实已经注入过了 */
const { parsed: expandEnv } = dotenvExpand(myEnv);

genrator(DOTENV_OUTPUT, config.genConfig);

writeFileAsync(DOTENV_OUTPUT, JsonToDotEnv(expandEnv));

console.log('[envmode]-------------注入灵魂---------------')
console.log(expandEnv);
console.log('[envmode]----------灵魂注入完毕---------------')

/** 注入灵魂, 并跑剩下的命令 */
spawn(OTHER_RAW_ARGS.join(' '), {
  shell: true,
  stdio: 'inherit',
  env: {
    ...process.env,
    // ...expandEnv,
  }
})
