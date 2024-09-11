import { createDebug } from '@utils/debug';
import { LogEventTypes } from '../constants';

export const debug = createDebug('Goods:debug');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debugLog = (type: LogEventTypes, params?: unknown, ...args: unknown[]) => {
  debug.log(`Log[${type}]: `, params, ...args);
};
