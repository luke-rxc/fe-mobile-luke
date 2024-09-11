/* eslint-disable react-hooks/exhaustive-deps */
import _merge from 'lodash/merge';
import _isFunction from 'lodash/isFunction';
import { v4 as uuid } from 'uuid';
import { useRef, useContext } from 'react';
import { useDeepCompareEffect } from 'react-use';
import { HeaderState } from '../types/header';
import { HeaderStateContext, HeaderDispatchContext } from '../contexts/HeaderContext';

/**
 * Header 상태를 가져오는 Hook
 */
export const useHeaderState = () => useContext(HeaderStateContext);

/**
 * Header 상태를 업데이트하는 Hook
 */
export const useHeaderDispatch = (state?: HeaderState) => {
  const dispatch = useContext(HeaderDispatchContext);
  const prevDescription = useRef<HeaderState['description']>();

  /**
   * 설명이 변경되었는지 확인하여 UUID 생성
   * @returns {string|boolean} - 설명이 변경되었다면 새로운 UUID, 아니면 false 반환
   */
  const isNotEqualDescription = (description: HeaderState['description']) => {
    return description !== prevDescription.current ? uuid() : false;
  };

  /**
   * Header 상태를 주어진 payload로 업데이트
   */
  const update = (payload: HeaderState | ((prevState: HeaderState) => HeaderState)) => {
    dispatch(payload);
  };

  /**
   * 주어진 payload를 기존 Header 상태와 병합
   */
  const merge = (payload: Partial<HeaderState> | ((prevState: HeaderState) => Partial<HeaderState>)) => {
    dispatch((oldState) => _merge({}, oldState, _isFunction(payload) ? payload(oldState) : payload));
  };

  /**
   * Header 상태 초기화
   */
  const clear = () => dispatch({});

  /**
   * 파라미터로 받은 state값의 변경이 발생할 경우 해당 값으로 Header state를 업데이트
   */
  useDeepCompareEffect(() => {
    prevDescription.current = state?.description;

    if (state) {
      update((oldState) => (state.type ? { ...state, element: oldState.element } : state));
    } else {
      clear();
    }
  }, [{ ...state, description: isNotEqualDescription(state?.description) }]);

  return { update, merge, clear };
};
