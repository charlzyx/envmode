import path from 'path';
import fs from 'fs';

/**
 * @param RAW_ARGS 命令行 --envmode[xxxx] 参数, 先不支持
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

export const getEnvmodeReader = (dir: string) =>  (mode: string) => {
  const filepath = path.resolve(dir, '.env.' + mode);
  if (filepath) {
    try {
      return fs.readFileSync(filepath, { encoding: 'utf-8' });
    } catch (error) {
      if (mode === 'default') {
        return '';
      }
      console.error(error);
      console.error('envmode error when read file from: ' + filepath)
      process.exit(-1);
    }
  } else {
    return '';
  }
}
