import dotenv from 'dotenv';
import fs from 'fs';
import { BANNER } from './config'

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
  console.log("json", json);
  const keys = Object.keys(json);
  return `
${BANNER}
${keys.map(key => `${key}=${json[key]}`).join('\n')}
${BANNER}
  `.trim();
}
