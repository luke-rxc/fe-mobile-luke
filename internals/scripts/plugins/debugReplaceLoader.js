/**
 * debug log namespace(prizm:경로:파일) 치환
 *
 * ```
 *  // 로더 실행전
 *  const debug = createDebug();
 *
 *  // 로더 실행후
 *  const debug = createDebug('utils:api:logHandler');
 * ```
 */
module.exports = function (source) {
  const filename = this.resourcePath
    .replace(/^.*\/src\//, '')
    .replace(/\//g, ':')
    .replace(/\.(js|jsx|ts|tsx)$/, '');
  return source.replace(/createDebug\(\)/, `createDebug('${filename}')`);
};
