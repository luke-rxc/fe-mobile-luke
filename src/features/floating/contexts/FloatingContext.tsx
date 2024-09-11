/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState, useMemo, useCallback, createContext } from 'react';
import {
  FloatingContextValueType,
  FloatingIdType,
  FloatingItemType,
  FloatingRootControllerType,
  FloatingItemControllerType,
} from '../types';

/**
 * FloatingContext
 */
export const FloatingContext = createContext<FloatingContextValueType>({
  list: [],
  rootController: { current: null },
  itemControllers: { current: new Map() },
  set: () => ({} as any),
  get: () => undefined,
  del: () => false,
  has: () => false,
  clear: () => {},
});

/**
 * FloatingProvider
 */
export const FloatingProvider: React.FC = ({ children }) => {
  /**
   * Floating Root를 제어하기 위해 Floating Root에 전달될 ref
   */
  const rootController = useRef<FloatingRootControllerType>(null);

  /**
   * Floating Item를 제어하기 위해 Floating Item에 전달될 ref
   */
  const itemControllers = useRef<Map<FloatingIdType, FloatingItemControllerType>>(new Map());

  /**
   * 모든 floating Item 데이터를 가지고 있는 Map객체
   */
  const [listMap, setListMap] = useState<Map<FloatingIdType, FloatingItemType>>(new Map());

  /**
   * 정렬된 floating Item 데이터 배열
   */
  const sortedList = useMemo(
    () =>
      Array.from(listMap.values()).sort((a, b) => {
        if (a.order === undefined || b.order === undefined) {
          // a.order 또는 b.order가 없는 경우 처리
          if (a.order === undefined) return 1;
          if (b.order === undefined) return -1;
        }
        return a.order - b.order;
      }),
    [listMap],
  );

  /**
   * ID에 해당하는 Floating Item 반환
   */
  const get: FloatingContextValueType['get'] = useCallback(
    (id: FloatingIdType) => {
      return listMap.get(id);
    },
    [listMap],
  );

  /**
   * Floating Item 추가 및 수정
   */
  const set: FloatingContextValueType['set'] = useCallback(
    (id, item) => {
      setListMap((prev) => new Map(prev).set(id, { id, ...item }));
      return { id, ...item };
    },
    [setListMap],
  );

  /**
   * ID에 해당하는 Floating Item 유무 반환
   */
  const has: FloatingContextValueType['has'] = useCallback((id) => listMap.has(id), [listMap]);

  /**
   * ID에 해당하는 Floating Item 제거
   */
  const del: FloatingContextValueType['del'] = useCallback((id) => {
    setListMap((prev) => {
      const newListMap = new Map(prev);

      if (newListMap.delete(id)) {
        itemControllers.current.delete(id);
        return newListMap;
      }

      return prev;
    });
  }, []);

  /**
   * 모든 Floating Item 삭제
   */
  const clear: FloatingContextValueType['clear'] = useCallback(() => setListMap(new Map()), [setListMap]);

  return (
    <FloatingContext.Provider value={{ list: sortedList, rootController, itemControllers, get, set, del, has, clear }}>
      {children}
    </FloatingContext.Provider>
  );
};
