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
  const defaultpath = path.resolve(dir, '.env.default');
  if (mode) {
    try {
      return fs.readFileSync(filepath, { encoding: 'utf-8' });
    } catch (error) {
      if (mode === 'default') {
        return '';
      }
      console.warn('[envmode] 没有找到配置文件: ' + filepath + ' 将使用默认值 ' + defaultpath )
    }
  } else {
    console.warn('[envmode] 没有指定 ENVMODE, 将使用默认值 ' + defaultpath)
  }
}
