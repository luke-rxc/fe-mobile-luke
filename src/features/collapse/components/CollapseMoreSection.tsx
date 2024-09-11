import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { Collapse, CollapseProps } from '@pui/collapse';
import { MoreLabel } from '@constants/ui';
import { COLLAPSE_CONTENT_LINE_HEIGHT, DEFAULT_COLLAPSE_DURATION } from '../constants';

export interface CollapseMoreSectionProps extends CollapseProps {
  /** 최대 노출 줄수(line) */
  expanderMaxLine?: number;
  /** onClick 이벤트 */
  onExpandView?: () => void;
}

export interface CollapseMoreSectionRef {
  /** wrapper element */
  ref: HTMLDivElement;
  /** collapsed 상태에서의 높이 */
  collapsedHeight: number;
}

const CollapseMoreSectionComponent = forwardRef<CollapseMoreSectionRef, CollapseMoreSectionProps>(
  (
    { expanded, collapseOptions, children, className, expanderMaxLine = 5, onExpandView: handleExpandView, ...props },
    ref,
  ) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLSpanElement>(null);

    const collapsedHeight = collapseOptions?.collapsedHeight ?? COLLAPSE_CONTENT_LINE_HEIGHT * expanderMaxLine;
    const duration = collapseOptions?.duration ?? DEFAULT_COLLAPSE_DURATION;

    useEffect(() => {
      const sectionEl = sectionRef.current;
      const contentEl = contentRef.current;

      sectionEl && sectionEl.style.setProperty('--transition-duration', `${duration}ms`);
      contentEl && contentEl.style.setProperty('--expander-max-lines', `${expanderMaxLine}`);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      ref: sectionRef.current as HTMLDivElement,
      collapsedHeight,
    }));

    return (
      <div
        ref={sectionRef}
        className={classnames(className, { 'has-more-button': !expanded })}
        onClick={handleExpandView}
      >
        <Collapse
          className={classnames('collapse-section', { 'is-short': !expanded })}
          expanded={expanded}
          collapseOptions={{
            collapsedHeight,
            duration,
            ...collapseOptions,
          }}
          {...props}
        >
          <span ref={contentRef} className="collapse-content">
            {children}
          </span>
        </Collapse>
        <div className={classnames('is-more', { 'is-view': !expanded })}>{MoreLabel}</div>
      </div>
    );
  },
);

export const CollapseMoreSection = styled(CollapseMoreSectionComponent)`
  position: relative;
  padding-bottom: 0;
  transition: padding var(--transition-duration);

  &.has-more-button {
    padding-bottom: 2.5rem;
    transition: none;

    &:active {
      opacity: 0.5;
    }
  }

  .collapse-section {
    position: relative;
    word-break: break-all;
    font: ${({ theme }) => theme.fontType.medium};
    font-size: 1.5rem;
    line-height: 1.8rem;
    opacity: 1;
    transition: opacity 200ms;

    &.is-short {
      .collapse-content {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: var(--expander-max-lines, 5);
        overflow: hidden;
      }
    }
  }

  .is-more {
    position: absolute;
    height: 1.7rem;
    margin-top: ${({ theme }) => theme.spacing.s8};
    font: ${({ theme }) => theme.fontType.small};
    color: ${({ theme }) => theme.color.text.textTertiary};
    opacity: 0;
    transition: opacity var(--transition-duration);

    &.is-view {
      opacity: 1;
    }
  }
`;
