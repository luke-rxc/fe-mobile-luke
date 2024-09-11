/**
 * Portal
 * @description 부모 컴포넌트의 DOM 계층 구조 바깥에 있는 DOM 노드로 자식을 렌더링
 * @example
 ```
  import React from 'react';
  import { Portal } from '@pui/portal';

  export const ToastPortal: React.FC = ({ children }) => <Portal elementId="floating-root">{children}</Portal>;
 ```
 * @reference https://ko.reactjs.org/docs/portals.html
 */

import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  /** Portal 내부에 들어갈 Children */
  children: React.ReactNode;
  /** Element ID */
  elementId: string;
}

export const Portal: React.FC<PortalProps> = ({ children, elementId }) => {
  const rootElement = useMemo(() => document.getElementById(elementId), [elementId]);
  return createPortal(children, rootElement as Element);
};
