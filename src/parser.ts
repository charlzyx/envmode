import dotenv from 'dotenv';
import fs from 'fs';

export const toEnvDefines = (json: Object) =>
  Object.keys(json).reduce((o, key) => {
    return {
      ...o,
      [`process.env.${key}`]: JSON.stringify(json[key]),
    };
  }, {});

export const parseDotEnv = (envFilePath: string) => {
  const filepath = envFilePath;
  const json = dotenv.parse(fs.readFileSync(filepath));
  return { defines: toEnvDefines(json), json: json };
};


export const JsonToDotEnv = (json: Record<string, string>) => {
  const keys = Object.keys(json);
  return `
# 这是 envmode 生成的文件, 不要手动修改!!, 建议添加到 .gitignore!
${keys.map(key => `${key}=${json[key]}\n`)}
# 这是 envmode 生成的文件, 不要手动修改!!, 建议添加到 .gitignore!
  `.trim();
}
