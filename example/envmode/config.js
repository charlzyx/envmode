/**
 config: {
    genConfig: {
      genEnvJsFilePaths: string | string[]
      genEnvTsFilePaths: string | string[]
      genEnvDefinesFilePaths: string | string[]
      genProcessTypeDefinesPaths: string | string[]
    }
 }
 */
const path = require('path');

const cwd = (file) => path.resolve(process.cwd(), file);

module.exports = {
  genConfig: {
    genEnvJsFilePaths: cwd('./env.js'),
    // genEnvDefinesFilePaths: cwd('./defines.js'),
    // genEnvTsFilePaths: [cwd('./web/ENV.ts'), cwd('./src/ENV.ts')],
    // genProcessTypeDefinesPaths: cwd('./typings/process.d.ts'),
  },
};
