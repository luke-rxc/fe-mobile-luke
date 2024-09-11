import React, { forwardRef, useRef, useState, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { flushSync } from 'react-dom';
import { useCollapse, UseCollapseOptions, UseCollapseReturnType } from '@hooks/useCollapse';

/**
 * Collapse 컴포넌트의 Ref Type
 */
export type CollapseRef = Partial<HTMLDivElement> & {
  setExpanded: UseCollapseReturnType<HTMLDivElement>['setExpanded'];
  getExpanded: () => void;
  handleToggle: () => void;
};

export interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 축소후 자식요소 삭제 여부 */
  removeChild?: boolean;
  /** 확장 여부 */
  expanded?: boolean;
  /** 초기 확장 여부 */
  defaultExpanded?: boolean;
  /** useCollapse options */
  collapseOptions?: Omit<UseCollapseOptions, 'expanded' | 'defaultExpanded'>;
}

/**
 * 확장/축소 기능을 위한 Collapse 컴포넌트
 *
 * **주의사항**
 * * Collapse에 padding을 사용하지 마세요.
 * * Collapse에 맞닿은 자식요소에 marginTop, marginBottom을 사용하지 마세요.
 */
export const Collapse = styled(
  forwardRef<CollapseRef, CollapseProps>(
    ({ removeChild, expanded, defaultExpanded, collapseOptions, children, ...props }, ref) => {
      const collapseRef = useRef<HTMLDivElement>(null);
      const [hideDOM, setHideDOM] = useState<boolean>(false);
      /**
       * useCollapse hook 설정
       */
      const { isExpanded, setExpanded, collapseProps } = useCollapse(collapseRef, {
        ...{ expanded, defaultExpanded, ...collapseOptions },
        onExpandStart: () => {
          collapseOptions?.onExpandStart?.();
          removeChild && !collapseOptions?.collapsedHeight && flushSync(() => setHideDOM(false));
        },
        onCollapseEnd: () => {
          collapseOptions?.onCollapseEnd?.();
          removeChild && !collapseOptions?.collapsedHeight && flushSync(() => setHideDOM(true));
        },
      });

      /**
       * ref로 참조할 수 있는 메소드 설정
       */
      useImperativeHandle(
        ref,
        () => ({
          ...(collapseRef.current || {}),
          setExpanded,
          getExpanded: () => isExpanded,
          handleToggle: () => setExpanded((exp) => !exp),
        }),
        [isExpanded, setExpanded],
      );

      return (
        <div ref={collapseRef} {...{ ...props, ...collapseProps }}>
          {!hideDOM && children}
        </div>
      );
    },
  ),
)``;
