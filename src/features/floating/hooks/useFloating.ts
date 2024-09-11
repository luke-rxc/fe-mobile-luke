/* eslint-disable react-hooks/exhaustive-deps, @typescript-eslint/no-unused-expressions */
import { useRef, useEffect, useContext, useCallback } from 'react';
import { useMount, useUnmount, useUpdateEffect } from 'react-use';
import { FloatingIdType, FloatingRenderType, FloatingItemType } from '../types';
import { FloatingItemState } from '../constants';
import { FloatingContext } from '../contexts';

type EventCallbacksType = Pick<UseFloatingOptionsType, 'onShown' | 'onHidden' | 'onAdded' | 'onRemoved'>;

export type UseFloatingOptionsType = Omit<FloatingItemType, 'id' | 'render'> & {
  /**
   * Floating ReRender를 위한 dependency 데이터
   */
  deps?: ReadonlyArray<unknown>;
  /**
   * Floating add/remove (DOM의 유무)
   * @default true
   */
  enabled?: boolean;
};

/**
 * id, render, options을 파라미터로 받는다.
 * id 값이 변경되면 기존에 있던 요소는 삭제 => 즉시 삭제
 */
export const useFloating = (id: FloatingIdType, render: FloatingRenderType, options: UseFloatingOptionsType) => {
  const floating = useContext(FloatingContext);

  /**
   * 파라미터로 받은 id에 해당하는 floatingItem의 유무를 체크
   */
  const hasFloatingItem = () => {
    return floating.has(idRef.current);
  };

  // options
  const { deps, order, enabled = true, defaultVisible, ...eventCb } = options || {};

  /**
   * ID memorization
   */
  const idRef = useRef<FloatingIdType>(id);

  /**
   * 이벤트콜백을 위한 Ref
   *
   * 이벤트콜백과 같이 함수인 파라미터의 경우 memorize 하지 않는 이상
   * dependency 체크가 어렵고 매번 Context를 업데이트를 해줘야 하는 이슈가 있어 클로져를 활용하기 위한 ref
   */
  const eventCbRef = useRef<EventCallbacksType>(eventCb);

  const eventCbClosure = useCallback(
    (): EventCallbacksType => ({
      onShown: () => eventCbRef.current.onShown?.(),
      onHidden: () => eventCbRef.current.onHidden?.(),
      onAdded: () => eventCbRef.current.onAdded?.(),
      onRemoved: () => eventCbRef.current.onRemoved?.(),
    }),
    [],
  );

  useEffect(() => {
    eventCbRef.current = {
      onShown: eventCb.onShown,
      onHidden: eventCb.onHidden,
      onAdded: eventCb.onAdded,
      onRemoved: eventCb.onRemoved,
    };
  }, [eventCb]);

  /**
   * Mount시 enabled값에 따른 floating 추가
   */
  useMount(() => {
    if (id) {
      idRef.current = id;
      enabled && floating.set(idRef.current, { render, order, defaultVisible, ...eventCbClosure() });
    }
  });

  /**
   * id, enabled값 변경에 따른 기존 floating 제거
   */
  useUpdateEffect(() => {
    // id값의 변경 혹은 enabled이 false이면 기존 플로팅을 제거
    if (!!id || id !== idRef.current || !enabled) {
      hasFloatingItem() && floating.del(idRef.current);
      idRef.current = id;
    }
  }, [id, enabled]);

  /**
   * id, enabled, dependency값 변경시 floating데이터 update
   */
  useUpdateEffect(() => {
    if (enabled && idRef.current) {
      floating.set(idRef.current, { render, order, defaultVisible, ...eventCbClosure() });
    }
  }, [id, enabled, ...(deps || [])]);

  /**
   * unmount floating요소가 추가되어 있으면 제거 처리
   */
  useUnmount(() => {
    hasFloatingItem() && floating.del(idRef.current);
  });

  return {
    show: (instant?: boolean): Promise<boolean> => {
      const floatingItem = floating.itemControllers.current.get(idRef.current);
      const showable =
        floatingItem?.state === FloatingItemState.hiding || floatingItem?.state === FloatingItemState.hidden;

      return floatingItem && showable ? floatingItem.show(instant) : new Promise((res) => res(false));
    },

    hide: (instant?: boolean): Promise<boolean> => {
      const floatingItem = floating.itemControllers.current.get(idRef.current);
      const hidable =
        floatingItem?.state === FloatingItemState.showing || floatingItem?.state === FloatingItemState.shown;

      return floatingItem && hidable ? floatingItem.hide(instant) : new Promise((res) => res(false));
    },

    remove: (instant?: boolean): Promise<boolean> => {
      const floatingItem = floating.itemControllers.current.get(idRef.current);
      const removable = floatingItem?.state !== FloatingItemState.removing;

      return floatingItem && removable ? floatingItem.remove(instant) : new Promise((res) => res(false));
    },
  };
};
