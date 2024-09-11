import isEmpty from 'lodash/isEmpty';
import { useState, useEffect } from 'react';
import { MwebHeaderRef } from '@pui/mwebHeader';
import { useHeaderState, useHeaderDispatch } from '../../hooks/useHeader';
import { WebHeader } from './WebHeader';
import { BrandHeader } from './BrandHeader';

/**
 * Landmark Header Component
 */
export const Header = () => {
  const state = useHeaderState();
  const dispatch = useHeaderDispatch();

  // ref 값이 변경될 때 리렌더링을 발생시키기 위해 useState 사용
  const [element, setElement] = useState<MwebHeaderRef | null>(null);

  /**
   * diff ref elements
   */
  const isEqualElements = (ref: MwebHeaderRef) => {
    return (
      ref.header?.isEqualNode(element?.header || null) &&
      ref.headerContainer?.isEqualNode(element?.headerContainer || null) &&
      ref.stickyContainer?.isEqualNode(element?.stickyContainer || null)
    );
  };

  /**
   * element ref 값이 변경되었을 때 setElement 실행
   */
  const updateElements = (ref: MwebHeaderRef) => {
    ref && !isEqualElements(ref) && setElement(ref);
  };

  /**
   * element store(context) dispatch
   */
  useEffect(() => {
    dispatch.merge({ element });

    const observer = new MutationObserver(() => {
      dispatch.merge({ element });
    });

    if (element?.headerContainer) {
      observer.observe(element.headerContainer, { subtree: true, attributes: true, characterData: true });
    }

    return () => {
      observer.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element]);

  if (isEmpty(state) || !state.enabled) {
    return null;
  }

  if (state.type === 'brand') {
    const { type, enabled, element: ref, ...props } = state;
    return <BrandHeader ref={updateElements} {...props} />;
  }

  if (state.type === 'mweb') {
    const { type, enabled, element: ref, ...props } = state;
    return <WebHeader ref={updateElements} {...props} />;
  }

  return null;
};
