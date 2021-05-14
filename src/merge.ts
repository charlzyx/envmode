import { BANNER } from './config'
const getKeysInDotEnv = (envStr) => {
  return envStr
    .split('\n')
    .filter((x) => !/^#/.test(x))
    .map((x) => x.split('=')[0])
    .filter((x) => !!x);
};

export const mergeEnv = (env, coverEnv) => {
  // 默认 env 的 keys
  const envKeys = getKeysInDotEnv(env);
  // 要覆盖的 env 里面的 keys
  const coverKeys = getKeysInDotEnv(coverEnv);
  // 找出冲突的 keys
  const conflictKeys = coverKeys.filter((ck) =>
    envKeys.find((ek) => ek === ck),
  );
  let finalEnv = env;
  // 通过加注释的方式, 把冲突的覆盖掉
  conflictKeys.forEach((x) => {
    const prefix = `${x}=`;
    finalEnv = finalEnv.replace(prefix, `# COVERED ${prefix}`);
  });

  return `
${BANNER}
${finalEnv}
${coverEnv}
${BANNER}
`.trim();
};
