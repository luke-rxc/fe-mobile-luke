import { useDDay } from '@services/useDDay';
import { toHHMMSS } from '@utils/toTimeformat';
import classNames from 'classnames';
import { HTMLAttributes, useEffect } from 'react';
import styled from 'styled-components';

const LIMIT = 60 * 2 * 1000;

export interface CheckoutCountDownProps extends HTMLAttributes<HTMLDivElement> {
  expiredDate: number;
  onExpired?: () => void;
}

const CheckoutCountDownComponent = ({ expiredDate, onExpired: handleExpired, ...rest }: CheckoutCountDownProps) => {
  const expiredDateMS = expiredDate || -1;
  const { countDown, isEnd } = useDDay({
    time: expiredDateMS,
    enabled: true,
  });
  const isNotice = expiredDateMS - Date.now() < LIMIT;
  const className = classNames(rest.className, { notice: isNotice });

  useEffect(() => {
    if (!isEnd) {
      return;
    }

    handleExpired?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnd]);

  return (
    <div {...rest} className={className}>
      <span className="count-down">{toHHMMSS(countDown)}</span>
    </div>
  );
};

export const CheckoutCountDown = styled(CheckoutCountDownComponent)`
  & {
    text-align: center;
    padding: 0.9rem 0;
    font: ${({ theme }) => theme.fontType.mediumB};
    color: ${({ theme }) => theme.color.text.textPrimary};
  }

  &.notice {
    & .count-down {
      color: ${({ theme }) => theme.color.semantic.error};
    }
  }
`;
