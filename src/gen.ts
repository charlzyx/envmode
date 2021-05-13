import fs from 'fs';
import { parseDotEnv }  from './parser';

export const genProcessTypeDefines = (envFilePath: string, ouputPath: string) => {
  const json = parseDotEnv(envFilePath).json;
  const keys = Object.keys(json).reduce((s, key) => {
    s = `${s}${key}: string; \n`;
    return s;
  }, '');
  const dtsfile = `
// 这是 envmode 生成的文件, 不要手动修改!!, 建议添加到 .gitignore
declare namespace NodeJS {
  export interface ProcessEnv {
${keys}
  }
}
// 这是 envmode 生成的文件, 不要手动修改!!, 建议添加到 .gitignore
  `.trim();
  fs.writeFileSync(ouputPath, dtsfile);
};

export const genEnvTsFile = (envFilePath: string, ouputPath: string) => {
  const json = parseDotEnv(envFilePath).json;
  const str = `
// 这是 envmode 生成的文件, 不要手动修改!!, 建议添加到 .gitignore
const ENV = ${JSON.stringify(json, null, 2)};
export default ENV;
export { ENV }
// 这是 envmode 生成的文件, 不要手动修改!!, 建议添加到 .gitignore
  `.trim();
  fs.writeFileSync(ouputPath, str);
};

export const genEnvJsFile = (envFilePath: string, ouputPath: string) => {
  const json = parseDotEnv(envFilePath).json;
  const str = `
// 这是 envmode 生成的文件, 不要手动修改!!, 建议添加到 .gitignore
module.exports = ${JSON.stringify(json, null, 2)};
// 这是 envmode 生成的文件, 不要手动修改!!, 建议添加到 .gitignore
`.trim();
  fs.writeFileSync(ouputPath, str);
};

export const genEnvDefinesFile = (envFilePath: string, ouputPath: string) => {
  const defines = parseDotEnv(envFilePath).defines;
  const str = `
// 这是 envmode 生成的文件, 不要手动修改!!, 建议添加到 .gitignore
module.exports = ${JSON.stringify(defines, null, 2)};
// 这是 envmode 生成的文件, 不要手动修改!!, 建议添加到 .gitignore
`.trim();
  fs.writeFileSync(ouputPath, str);
};


const runEach = <T>(maybe: T | T[], runner: (x: T) => void) => {
  if (Array.isArray(maybe)) {
    maybe.forEach(x => runner(x));
  } else {
    runner(maybe)
  }
}

export const genrator = (envFilePath: string, genConfig: {
  genEnvJsFilePaths: string | string[]
  genEnvTsFilePaths: string | string[]
  genEnvDefinesFilePaths: string | string[]
  genProcessTypeDefinesPaths: string | string[]
}) => {
  if (genConfig.genEnvJsFilePaths) {
    runEach(genConfig.genEnvJsFilePaths, (item) => genEnvJsFile(envFilePath, item))
  }
  if (genConfig.genEnvTsFilePaths) {
    runEach(genConfig.genEnvTsFilePaths, (item) => genEnvTsFile(envFilePath, item))
  }
  if (genConfig.genEnvDefinesFilePaths) {
    runEach(genConfig.genEnvDefinesFilePaths, (item) => genEnvDefinesFile(envFilePath, item))
  }
  if (genConfig.genProcessTypeDefinesPaths) {
    runEach(genConfig.genProcessTypeDefinesPaths, (item) => genProcessTypeDefines(envFilePath, item))
  }

}
