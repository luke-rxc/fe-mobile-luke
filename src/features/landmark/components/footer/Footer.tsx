/* eslint-disable react-hooks/exhaustive-deps */
import isEmpty from 'lodash/isEmpty';
import { useState, useEffect } from 'react';
import { Footer as FooterComponent } from '@pui/footer';
import { useFooterState, useFooterDispatch } from '../../hooks/useFooter';

/**
 * Landmark Footer
 */
export const Footer = () => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const state = useFooterState();
  const dispatch = useFooterDispatch();

  useEffect(() => {
    element && dispatch.merge({ element });
  }, [state, element]);

  if (isEmpty(state) || !state.enabled) {
    return null;
  }

  return <FooterComponent ref={(el) => setElement(el)} expanded={state.expanded} hidePolicyLink={state.hideLinks} />;
};
