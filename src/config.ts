import path from 'path';
import fs from 'fs';

export const BANNER = '// 这是 envmode 生成的文件, 不要手动修改!!, 建议添加到 .gitignore';
export const BASH_BANNER = '# 这是 envmode 生成的文件, 不要手动修改!!, 建议添加到 .gitignore';

/**
 * @param RAW_ARGS 命令行 --env.[xxxx] 参数, 先不支持
 */
export const getConfig = (RAW_ARGS?: string[]) => {
  const dir = path.resolve(process.cwd(), './envmode');
  const confFilePath = path.resolve(dir, './config.js');
  const has = fs.existsSync(confFilePath);
  const genConf = has ? require(confFilePath).genConfig : {};
  return {
    envmodeDir: dir,
    genConfig: Object.assign({}, genConf)
  }
}

export const getEnvmodeReader = (dir: string) => (mode: string) => {
  const filepath = path.resolve(dir, '.env.' + mode);
  if (mode) {
    try {
      return fs.readFileSync(filepath, { encoding: 'utf-8' });
    } catch (error) {
      if (mode === 'default') {
        return '';
      }
      console.error(error);
      console.error('[envmode] error when read file from: ' + filepath)
      process.exit(-1);
    }
  } else {
    console.error(`[envmode] .env.{mode} ${filepath} not found, please add.`)
    process.exit(-1);
  }
}
