import path from 'path';
import fs from 'fs';

export const BANNER =
  '// 这是 envmode 生成的文件, 不要手动修改!!, 建议添加到 .gitignore';
export const BASH_BANNER =
  '# 这是 envmode 生成的文件, 不要手动修改!!, 建议添加到 .gitignore';

export type TOptions = {
  dir: string;
  mode: string;
};
export type TConfig = {
  genConfig?: {
    genEnvJsFilePaths?: string | string[];
    genEnvTsFilePaths?: string | string[];
    genEnvDefinesFilePaths?: string | string[];
    genProcessTypeDefinesPaths?: string | string[];
  };
};

const getDir = (x = './envmode') => {
  const isAbs = /^\//.test(x);
  return isAbs ? x : path.resolve(process.cwd(), x);
};

export const getConfig = (opts?: TOptions) => {
  const dir = getDir(opts.dir);
  const confFilePath = path.resolve(dir, './config.js');
  const has = fs.existsSync(confFilePath);
  const conf: TConfig = has ? require(confFilePath) : {};
  return {
    dir,
    conf,
    tmpDotEnv: `${dir}/.env.ignore`,
  };
};

export const getEnvmodeReader = (dir: string) => (mode: string) => {
  const filepath = path.resolve(dir, `.env.${mode}`);
  const defaultpath = path.resolve(dir, '.env');
  if (mode) {
    try {
      return fs.readFileSync(filepath, { encoding: 'utf-8' });
    } catch (error) {
      if (mode === 'default') {
        return fs.readFileSync(defaultpath, { encoding: 'utf-8' });
      } else {
        console.warn(
          `[envmode] 没有找到配置文件: ${filepath} 将使用默认值 ${defaultpath}`,
        );
      }
    }
  } else {
    console.warn(`[envmode] 没有指定 ENVMODE, 将使用默认值 ${defaultpath}`);
  }
};
