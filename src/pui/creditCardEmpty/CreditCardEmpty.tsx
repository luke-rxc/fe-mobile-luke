import { Plus } from '@pui/icon';
import classnames from 'classnames';
import { forwardRef } from 'react';
import styled from 'styled-components';
import { Action, ActionProps } from '@pui/action';

export type CreditCardEmptyProps = Extract<ActionProps, { is?: 'button' }>;

const CreditCardEmptyComponent = forwardRef<HTMLButtonElement, CreditCardEmptyProps>(({ ...rest }, ref) => {
  const className = classnames(rest.className);

  return (
    <Action {...rest} ref={ref} className={className}>
      <div className="prizm-card">
        <p className="btn-info">
          <Plus size="2.4rem" color="gray50" />
          <span className="btn-title">카드 추가</span>
        </p>
      </div>
    </Action>
  );
});

/**
 * Figma CreditCardEmpty 컴포넌트
 */
export const CreditCardEmpty = styled(CreditCardEmptyComponent)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.r8};
  background: ${({ theme }) => theme.color.background.surface};
  border: 0.1rem solid ${({ theme }) => theme.color.backgroundLayout.line};
  position: relative;
  max-width: 24rem;

  .prizm-card {
    position: relative;
    width: 100%;
    background: ${({ theme }) => theme.color.background.surface};
    padding-bottom: 14.2rem;
    border-radius: ${({ theme }) => theme.radius.r8};

    & .btn-info {
      position: absolute;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    & .btn-title {
      margin-top: 0.4rem;
      color: ${({ theme }) => theme.color.text.textTertiary};
      font: ${({ theme }) => theme.fontType.small};
    }
  }
`;
