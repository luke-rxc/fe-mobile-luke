import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { ChevronDown } from '@pui/icon';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /** select box 우측 커스터마이징 영역 */
  suffix?: React.ReactNode;
  /** placeholder */
  placeholder?: string;
  /** 활성화 유무 */
  disabled?: boolean;
  /** 사이즈 */
  size?: 'large' | 'medium';
}

export const AnchorSelect = ({ suffix, placeholder, disabled, size, className: classNameProps, ...rest }: Props) => {
  const className = classnames(classNameProps, { disabled });

  return (
    <Wrapper className={className} {...rest}>
      <div className="placeholder">{placeholder}</div>
      <div className="suffix-box">
        {suffix ?? <ChevronDown className="icon" color="gray50" size={size === 'large' ? '2.4rem' : '1.6rem'} />}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 5.6rem;
  padding: 0 ${({ theme }) => theme.spacing.s12} 0 ${({ theme }) => theme.spacing.s16};
  border-radius: ${({ theme }) => theme.radius.r8};
  background-color: ${({ theme }) => theme.color.background.surface};

  &.disabled {
    touch-action: none;
    pointer-events: none;
    background: ${({ theme }) => theme.color.gray3};
    color: ${({ theme }) => theme.color.text.textDisabled};

    .suffix-box {
      svg *[fill] {
        fill: ${({ theme }) => theme.color.gray20} !important;
      }
    }
  }

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 1px solid ${({ theme }) => theme.color.backgroundLayout.line};
    border-radius: ${({ theme }) => theme.radius.r8};
    content: '';
    pointer-events: none;
  }

  .placeholder {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .suffix-box {
    .icon {
      transform: rotate(-90deg);
    }
  }
`;
