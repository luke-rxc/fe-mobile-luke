/* eslint-disable react-hooks/exhaustive-deps */
import _merge from 'lodash/merge';
import isFunction from 'lodash/isFunction';
import { useContext } from 'react';
import { useDeepCompareEffect } from 'react-use';
import { NavigationState } from '../types/navigation';
import { NavigationStateContext, NavigationDispatchContext } from '../contexts/NavigationContext';

/**
 * navigation getter
 */
export const useNavigationState = () => useContext(NavigationStateContext);

/**
 * navigation setter
 */
export const useNavigationDispatch = (state?: NavigationState) => {
  const dispatch = useContext(NavigationDispatchContext);

  /**
   * navigation state를 인자값으로 대체
   */
  const update = (payload: React.SetStateAction<NavigationState>) => {
    dispatch(payload);
  };

  /**
   * 기존 navigation state와 인자값을 병합
   */
  const merge = (payload: Partial<NavigationState> | ((prevState: NavigationState) => Partial<NavigationState>)) => {
    dispatch((oldState) => _merge({}, oldState, isFunction(payload) ? payload(oldState) : payload));
  };

  /**
   * navigation state clear
   */
  const clear = () => {
    dispatch({});
  };

  useDeepCompareEffect(() => {
    state && merge(state);
  }, [{ ...state }]);

  return { update, merge, clear };
};
