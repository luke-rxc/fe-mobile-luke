import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { v4 as uuid } from 'uuid';
import { Collapse } from '@pui/collapse';
import { ChevronDown } from '@pui/icon';
import { TitleSub } from '@pui/titleSub';

interface CollapseSubProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  expanded: boolean;
}

const CollapseSubComponent = ({ title, className, children, expanded: expandedProps, ...props }: CollapseSubProps) => {
  /**
   * Collapse Id
   */
  const collapseId = useMemo(() => {
    return uuid().slice(8);
  }, []);

  /**
   * Collapse 영역 collapse/expand 상태값
   */
  const [expanded, setExpanded] = useState<boolean>(expandedProps);

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

export const CollapseSub = styled(CollapseSubComponent)`
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
