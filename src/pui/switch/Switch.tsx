import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  block?: boolean;
}

const SwitchComponent = forwardRef<HTMLInputElement, SwitchProps>(({ className, children, block, ...props }, ref) => {
  const { isIOS } = useDeviceDetect();

  return (
    <label className={`${className} ${isIOS ? 'is-ios' : 'is-aos'}`}>
      <input ref={ref} type="checkbox" {...props} />
      <span className="switch-handler">
        <span className="switch-handler-dot" />
      </span>
    </label>
  );
});

/**
 * Switch 컴포넌트
 *
 * Notion - https://www.notion.so/rxc/Switch-c7e906978c704f0896138738a0dcf960
 */
export const Switch = styled(SwitchComponent)`
  position: relative;
  display: ${({ block }) => (block ? 'block' : 'inline-block')};
  cursor: pointer;
  ${({ readOnly }) => (readOnly ? `pointer-events: none; touch-action: none;` : '')}

  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    opacity: 0;
  }

  .switch-handler {
    position: relative;
    display: inline-block;
    width: 5.1rem;
    height: 3.1rem;
    vertical-align: middle;
  }

  /** ************************************************************
   * ios
   ************************************************************ */
  &.is-ios {
    .switch-handler {
      border-radius: 1.55rem;
      background: ${({ theme }) => theme.color.gray20};
      transition: background 0.3s ease-in-out;

      .switch-handler-dot {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        width: 3.1rem;
        height: 3.1rem;
        padding: ${({ theme }) => theme.spacing.s2};
        transition: left 0.25s cubic-bezier(0.36, 1.24, 0.64, 1.02);

        &:after {
          display: block;
          height: 100%;
          border-radius: 50%;
          background: ${({ theme }) => theme.color.white};
          box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15), 0px 3px 1px rgba(0, 0, 0, 0.06);
          content: '';
        }
      }
    }

    input:checked + .switch-handler {
      background: ${({ theme }) => theme.color.brand.tint};

      .switch-handler-dot {
        left: calc(100% - 3.1rem);
      }
    }

    input:disabled + .switch-handler {
      background: ${({ theme }) => theme.color.gray50};
    }
  }

  /** ************************************************************
   * android
   ************************************************************ */
  &.is-aos {
    .switch-handler {
      transition: opacity 0.25s cubic-bezier(0.36, 1.24, 0.64, 1.02);

      &-dot {
        /** background style */
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 3.6rem;
        height: 1.4rem;
        border-radius: 1.6rem;
        background: ${({ theme }) => theme.color.gray50};
        transform: translate3d(-50%, -50%, 0);

        &:after {
          /** dot style */
          position: absolute;
          top: 50%;
          left: 0;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: ${({ theme }) => theme.color.white};
          box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2);
          transform: translateY(-50%);
          transition: left 150ms cubic-bezier(0.4, 0, 0.2, 1), background 150ms cubic-bezier(0.36, 1.24, 0.64, 1.02);
          will-change: left, background;
          content: '';
        }
      }
    }

    input:checked + .switch-handler {
      .switch-handler-dot:after {
        background: ${({ theme }) => theme.color.brand.tint};
        left: calc(100% - 2rem);
      }
    }

    input:disabled + .switch-handler {
      opacity: 0.5;

      .switch-handler-dot:after {
        background: ${({ theme }) => theme.color.brand.tint};
      }
    }
  }
`;
