import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { v4 as uuid } from 'uuid';
import { TitleSection } from '@pui/titleSection';
import { Collapse } from '@pui/collapse';
import { ChevronDown } from '@pui/icon';

export interface CollapseSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  onClickTitle: (expanded: boolean) => void;
}

export const CollapseSection = styled(
  ({ title, className, children, onClickTitle: handleClickTitle, ...props }: CollapseSectionProps) => {
    /**
     * Collapse Id
     */
    const collapseId = useMemo(() => {
      return uuid().slice(8);
    }, []);

    /**
     * Collapse 영역 collapse/expand 상태값
     */
    const [expanded, setExpanded] = useState<boolean>(false);

    /**
     * Collapse 영역 collapse/expand
     */
    const handleToggle = () => {
      handleClickTitle(expanded);
      setExpanded((prev) => !prev);
    };

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
  background: ${({ theme }) => theme.color.whiteVariant1};

  ${ChevronDown} {
    transform: rotate(0);
    transition: transform 0.2s ease-in-out;
  }

  &.is-expanded {
    ${ChevronDown} {
      transform: rotate(180deg);
      transition: transform 0.2s ease-in-out;
    }
  }

  .title {
    font: ${({ theme }) => theme.fontType.mediumB};
  }
`;
