/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useCallback } from 'react';
import { useDeepCompareMemoize } from '@hooks/useDeepCompareMemoize';
import { NavigationState, NavigationDispatch } from '../types/navigation';

/**
 * navigation state context
 */
export const NavigationStateContext = createContext<NavigationState>({});

/**
 * navigation dispatch context
 */
export const NavigationDispatchContext = createContext<NavigationDispatch>(() => {});

/**
 * NavigationProvider
 */
export const NavigationProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<NavigationState>({});
  const dispatch = useCallback(setState, []);

  return (
    <NavigationStateContext.Provider value={useDeepCompareMemoize(state)}>
      <NavigationDispatchContext.Provider value={dispatch}>{children}</NavigationDispatchContext.Provider>
    </NavigationStateContext.Provider>
  );
};
