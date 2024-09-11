import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Action } from '@pui/action';

export type DropDownProps = HTMLAttributes<HTMLDivElement> & {
  menus: {
    label: React.ReactNode | string;
    action: () => void;
  }[];
  onClose?: () => void;
};

const DropDownComponent = forwardRef<HTMLDivElement, DropDownProps>(({ className, menus = [], onClose }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isBottom, setIsBottom] = useState(false);
  const handleDisabledBackDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      const isMenuElement = e.target.classList.contains('drop-item');
      if (!isMenuElement) {
        e.preventDefault();
        e.stopPropagation();
        onClose?.();
      }
    },
    [onClose],
  );

  useLayoutEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const { outerHeight } = containerRef.current.ownerDocument.defaultView as Window;
      const { top } = rect;

      if (top > outerHeight * 0.75) {
        setIsBottom(true);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleDisabledBackDrop, { capture: true });
    window.addEventListener('touchmove', handleDisabledBackDrop, { capture: true });
    return () => {
      window.removeEventListener('click', handleDisabledBackDrop, { capture: true });
      window.removeEventListener('touchmove', handleDisabledBackDrop, { capture: true });
    };
  }, [handleDisabledBackDrop]);

  return (
    <div ref={ref} className={className}>
      <div
        className={classNames('drop-menu', {
          'is-bottom': isBottom,
        })}
        ref={containerRef}
      >
        <div className="drop-inner">
          {menus.length && (
            <ul>
              {menus.map((menu, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index} className="menu">
                  <Action is="button" className="drop-item" onClick={menu.action}>
                    {menu.label}
                  </Action>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
});

export const DropDown = styled(DropDownComponent)`
  position: relative;

  & .drop-inner {
    position: absolute;
    top: 0;
    z-index: 1;
    width: 100%;
    border-radius: ${({ theme }) => theme.radius.r12};
    background: ${({ theme }) => theme.color.white};
    box-shadow: 0 0.2rem 3.2rem rgba(0, 0, 0, 0.05);

    & .menu {
      border-top: ${({ theme }) => `1px solid ${theme.color.gray8}`};

      &:first-child {
        border: none;
      }
    }

    ${Action} {
      width: 100%;
      height: 100%;
      padding: 1.9rem 1.6rem;
      color: ${({ theme }) => theme.color.text.textPrimary};
      font: ${({ theme }) => theme.content.contentStyle.fontType.medium};
      text-align: left;
    }
  }

  & .drop-menu {
    position: relative;

    &.is-bottom {
      & .drop-inner {
        top: initial;
        bottom: 0;
      }
    }
  }
`;
