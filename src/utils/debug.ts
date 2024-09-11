import debug from 'debug';
import env from '@env';
import { getLocalStorage } from '@utils/storage';

if (env.isProduction) {
  debug.disable();
} else {
  // localStorage에 debug 설정이 없는 경우 'prizm*'으로 기본값 사용
  !getLocalStorage('debug') && debug.enable('prizm*');
}

/**
 * Error Log
 */
export const error = debug('prizm');
error.log = window.console.error.bind(console);

/**
 * Info Log
 */
export const info = debug('prizm');
info.log = window.console.info.bind(console);

/**
 * Warn Log
 */
export const warn = debug('prizm');
warn.log = window.console.warn.bind(console);

/**
 * General Log
 */
export const log = debug('prizm');
log.log = window.console.log.bind(console);

/**
 * Create Debug
 *
 * @param namespace 네임 스페이스
 * @returns namespace logs
 */
export const createDebug = (namespace = '') => {
  return {
    error: error.extend(namespace),
    info: info.extend(namespace),
    warn: warn.extend(namespace),
    log: log.extend(namespace),
  };
};

export default { error, info, warn, log };
