const getKeysInDotEnv = (envStr: string = '') => {
  return envStr
    .split('\n')
    .filter((x) => !/^#/.test(x))
    .map((x) => x.split('=')[0])
    .filter((x) => !!x);
};

/**
 * 将下面这种表达式中的值替换为 process.env 里面的对应值, 没有则为 ''
 * VAR=${VAR}
 * dotenvExpand  在解析的时候会报递归解析错误, 所以对这种同名的
 *
 */

export const mergeEnv = (env: string, coverEnv: string) => {
  if (env === coverEnv) {
    return env;
  }
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
${finalEnv}
${coverEnv}
`.trim();
};
