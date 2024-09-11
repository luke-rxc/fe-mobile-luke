/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useCallback } from 'react';
import { useDeepCompareMemoize } from '@hooks/useDeepCompareMemoize';
import { HeaderState, HeaderDispatch } from '../types/header';

/**
 * Header state context
 */
export const HeaderStateContext = createContext<HeaderState>({});

/**
 * Header dispatch context
 */
export const HeaderDispatchContext = createContext<HeaderDispatch>(() => {});

/**
 * HeaderProvider
 */
export const HeaderProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<HeaderState>({});
  const dispatch = useCallback(setState, []);

  return (
    <HeaderStateContext.Provider value={useDeepCompareMemoize(state)}>
      <HeaderDispatchContext.Provider value={dispatch}>{children}</HeaderDispatchContext.Provider>
    </HeaderStateContext.Provider>
  );
};
