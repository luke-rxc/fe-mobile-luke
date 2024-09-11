/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useCallback } from 'react';
import { useDeepCompareMemoize } from '@hooks/useDeepCompareMemoize';
import { FooterState, FooterDispatch } from '../types/footer';

/**
 * Footer state context
 */
export const FooterStateContext = createContext<FooterState>({});

/**
 * Footer dispatch context
 */
export const FooterDispatchContext = createContext<FooterDispatch>(() => {});

/**
 * FooterProvider
 */
export const FooterProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<FooterState>({});
  const dispatch = useCallback(setState, []);

  return (
    <FooterStateContext.Provider value={useDeepCompareMemoize(state)}>
      <FooterDispatchContext.Provider value={dispatch}>{children}</FooterDispatchContext.Provider>
    </FooterStateContext.Provider>
  );
};
