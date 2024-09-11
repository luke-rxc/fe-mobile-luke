import { forwardRef, useCallback, useEffect, useRef } from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Action } from '@pui/action';

/**
 * 리뷰 더보기
 */
export type DropDownProps = HTMLAttributes<HTMLDivElement> & {
  menus: {
    label: React.ReactNode | string;
    action: () => void;
  }[];
  onClose?: () => void;
};

const DropDownComponent = forwardRef<HTMLDivElement, DropDownProps>(({ className, menus = [], onClose }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleDisabledBackDrop = useCallback(
    (e: TouchEvent | Event) => {
      const isMenuElement = (e.target as Element).classList.contains('drop-item');
      if (!isMenuElement) {
        e.preventDefault();
        e.stopPropagation();
        onClose?.();
      }
    },
    [onClose],
  );

  const handleItemClick = useCallback((e, menu) => {
    e.preventDefault();
    e.stopPropagation();
    menu.action();
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
      <div className={classNames('drop-menu', {})} ref={containerRef}>
        <div className="drop-inner">
          {menus.length && (
            <ul>
              {menus.map((menu) => (
                <li key={`${menu.label}`} className="menu">
                  <Action is="button" className="drop-item" onClick={(e) => handleItemClick(e, menu)}>
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
    z-index: 10;
    width: 100%;
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
      color: ${({ theme }) => theme.color.black};
      font: ${({ theme }) => theme.fontType.medium};
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
