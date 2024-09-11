import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { v4 as uuid } from 'uuid';
import { TitleSection } from '@pui/titleSection';
import { Collapse } from '@pui/collapse';
import { ChevronDown } from '@pui/icon';

export interface CollapseSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section 제목 */
  title: string;
  /**
   * 초기 Collapse Section의 확장/축소 상태값
   * @default true
   */
  defaultExpanded?: boolean;
}

export const CollapseSection = styled(
  ({ title, defaultExpanded = true, className, children, ...props }: CollapseSectionProps) => {
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
        <TitleSection
          role="button"
          tabIndex={0}
          title={title}
          aria-expanded={expanded}
          aria-controls={collapseId}
          suffix={<ChevronDown />}
          onClick={handleToggle}
        />
        <Collapse id={collapseId} expanded={expanded}>
          <div className="collapse-inner">{children}</div>
        </Collapse>
      </div>
    );
  },
)`
  background: ${({ theme }) => theme.color.background.surface};

  .collapse-inner {
    padding-bottom: ${({ theme }) => theme.spacing.s24};
  }

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
