import { useRef } from 'react';
import isEqual from 'lodash/isEqual';

/**
 * 깊은 비교를 통한 memoize된 value를 반한
 */
export const useDeepCompareMemoize = <T extends unknown>(value: T): T => {
  const ref = useRef<T>(value);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
};
