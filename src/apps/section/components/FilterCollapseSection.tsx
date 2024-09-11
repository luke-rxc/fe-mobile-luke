import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { v4 as uuid } from 'uuid';
import { TitleSub } from '@pui/titleSub';
import { Collapse } from '@pui/collapse';
import { ChevronDown } from '@pui/icon';

export interface FilterCollapseSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Collapse Section 제목 */
  title: string;
  /** Collapse Section의 확장/축소 초기값 */
  expanded?: boolean;
}

/**
 * Filter Section Collapse 컴포넌트
 *
 * @see {@link src/apps/mypage/order/components/CollapseSection.tsx} 소스 참고
 */
const FilterCollapseSectionComponent = ({
  title,
  expanded: defaultExpanded = false,
  className,
  children,
  ...props
}: FilterCollapseSectionProps) => {
  /**
   * Collapse Id
   */
  const collapseId = useMemo(() => {
    return uuid().slice(8);
  }, []);

  /**
   * Collapse 영역 collapse/expand 상태값
   */
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  /**
   * Collapse 영역 collapse/expand
   */
  const handleToggle = () => setExpanded((prev) => !prev);

  return (
    <div className={classnames(className, { 'is-expanded': expanded })} {...props}>
      <TitleSub
        role="button"
        tabIndex={0}
        title={title}
        aria-expanded={expanded}
        aria-controls={collapseId}
        suffix={<ChevronDown />}
        onClick={handleToggle}
      />
      <Collapse id={collapseId} expanded={expanded}>
        {children}
      </Collapse>
    </div>
  );
};

export const FilterCollapseSection = styled(FilterCollapseSectionComponent)`
  background: ${({ theme }) => theme.color.background.surface};

  ${ChevronDown} {
    transform: rotate(0deg) !important;
    transition: transform 0.3s;
  }

  &.is-expanded {
    ${ChevronDown} {
      transform: rotate(180deg) !important;
    }
  }
`;
