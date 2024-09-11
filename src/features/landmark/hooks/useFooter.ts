/* eslint-disable react-hooks/exhaustive-deps */
import _merge from 'lodash/merge';
import isFunction from 'lodash/isFunction';
import { useContext } from 'react';
import { useDeepCompareEffect } from 'react-use';
import { FooterState } from '../types/footer';
import { FooterStateContext, FooterDispatchContext } from '../contexts/FooterContext';

/**
 * Footer getter
 */
export const useFooterState = () => useContext(FooterStateContext);

/**
 * Footer setter
 */
export const useFooterDispatch = (state?: FooterState) => {
  const dispatch = useContext(FooterDispatchContext);

  /**
   * Footer state를 인자값으로 대체
   */
  const update = (payload: React.SetStateAction<FooterState>) => {
    dispatch(payload);
  };

  /**
   * 기존 Footer state와 인자값을 병합
   */
  const merge = (payload: Partial<FooterState> | ((prevState: FooterState) => Partial<FooterState>)) => {
    dispatch((oldState) => _merge({}, oldState, isFunction(payload) ? payload(oldState) : payload));
  };

  /**
   * Footer state clear
   */
  const clear = () => {
    dispatch({});
  };

  useDeepCompareEffect(() => {
    state && merge(state);
  }, [{ ...state }]);

  return { update, merge, clear };
};
