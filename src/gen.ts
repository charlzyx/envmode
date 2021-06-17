import fs from 'fs';
import { parseDotEnv } from './parser';
import { BANNER, TConfig } from './config';

export const genProcessTypeDefines = (
  envFilePath: string,
  ouputPath: string,
) => {
  const json = parseDotEnv(envFilePath).json;
  const keys = Object.keys(json).reduce((s, key) => {
    s = `    ${s}${key}: string; \n`;
    return s;
  }, '');
  const dtsfile = `
${BANNER}
declare namespace NodeJS {
  export interface ProcessEnv {
${keys}
  }
}
${BANNER}
  `.trim();
  try {
    fs.writeFileSync(ouputPath, dtsfile);
  } catch (error) {
    console.log('[envmode] gen err: ', error);
  }
};

export const genEnvTsFile = (envFilePath: string, ouputPath: string) => {
  const json = parseDotEnv(envFilePath).json;
  const str = `
${BANNER}
const ENV = ${JSON.stringify(json, null, 2)};
export default ENV;
export { ENV }
${BANNER}
  `.trim();
  try {
    fs.writeFileSync(ouputPath, str);
  } catch (error) {
    console.log('[envmode] gen err: ', error);
  }
};

export const genEnvJsFile = (envFilePath: string, ouputPath: string) => {
  const json = parseDotEnv(envFilePath).json;
  const str = `
${BANNER}
module.exports = ${JSON.stringify(json, null, 2)};
${BANNER}
`.trim();
  try {
    fs.writeFileSync(ouputPath, str);
  } catch (error) {
    console.log('[envmode] gen err: ', error);
  }
};

export const genEnvDefinesFile = (envFilePath: string, ouputPath: string) => {
  const defines = parseDotEnv(envFilePath).defines;
  const str = `
${BANNER}
module.exports = ${JSON.stringify(defines, null, 2)};
${BANNER}
`.trim();
  try {
    fs.writeFileSync(ouputPath, str);
  } catch (error) {
    console.log('[envmode] gen err: ', error);
  }
};

const runEach = <T>(maybe: T | T[], runner: (x: T) => void) => {
  if (Array.isArray(maybe)) {
    maybe.forEach((x) => runner(x));
  } else {
    runner(maybe);
  }
};

export const genrator = (
  envFilePath: string,
  genConfig: TConfig['genConfig'],
) => {
  if (genConfig.genEnvJsFilePaths) {
    runEach(genConfig.genEnvJsFilePaths, (item) =>
      genEnvJsFile(envFilePath, item),
    );
  }
  if (genConfig.genEnvTsFilePaths) {
    runEach(genConfig.genEnvTsFilePaths, (item) =>
      genEnvTsFile(envFilePath, item),
    );
  }
  if (genConfig.genEnvDefinesFilePaths) {
    runEach(genConfig.genEnvDefinesFilePaths, (item) =>
      genEnvDefinesFile(envFilePath, item),
    );
  }
  if (genConfig.genProcessTypeDefinesPaths) {
    runEach(genConfig.genProcessTypeDefinesPaths, (item) =>
      genProcessTypeDefines(envFilePath, item),
    );
  }
};
