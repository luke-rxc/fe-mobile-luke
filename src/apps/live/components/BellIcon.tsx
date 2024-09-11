import { Action } from '@pui/action';
import styled from 'styled-components';
import { BellFilled, LottieRef } from '@pui/lottie';
import classnames from 'classnames';
import { useEffect, useRef } from 'react';
import { useUpdateEffect } from 'react-use';
import { LiveActionType } from '../constants';
import { LiveActionProps } from '../types';

interface Props {
  scheduleId: number;
  followed: boolean;
  onClick: (path: LiveActionType, actionProps?: LiveActionProps) => (event: React.MouseEvent) => void;
}

/**
 * 알림 icon
 */
export const BellIcon = ({ scheduleId, followed, onClick: handleClick }: Props) => {
  const lottie = useRef<LottieRef>(null);
  const initialized = useRef<boolean | null>(null);

  /**
   * 초기 로띠 설정
   */
  useEffect(() => {
    if (lottie.current?.player) {
      lottie.current?.player.goToAndStop(followed ? 60 : 0, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!lottie.current]);

  /**
   * 알림상태 변경에 따른 로띠 제어
   */
  useUpdateEffect(() => {
    const player = lottie.current?.player;
    initialized.current = initialized.current ?? true;

    if (player) {
      // eslint-disable-next-line no-nested-ternary, @typescript-eslint/no-unused-expressions
      followed ? (initialized.current ? player.goToAndStop(60, true) : player.play()) : player.goToAndStop(0);
      initialized.current = false;
    }
  }, [followed]);

  return (
    <ActionButton
      is="button"
      className={classnames({ 'is-followed': followed })}
      onClick={handleClick(LiveActionType.LIVE_FOLLOW, { scheduleId })}
    >
      <BellFilled
        ref={lottie}
        animationOptions={{
          loop: false,
          autoplay: false,
        }}
      />
    </ActionButton>
  );
};

const ActionButton = styled(Action)`
  position: absolute;
  z-index: 4;
  top: 0;
  right: 0;
  width: 5.6rem;
  height: 5.6rem;
  justify-content: center;
  align-items: center;
  line-height: 0;
  color: #fff;
  -webkit-tap-highlight-color: transparent;

  &:before {
    display: inline-block;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: background-color 0.2s;
    backdrop-filter: blur(25px);
    content: '';
  }

  ${BellFilled} {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2.4rem;
    height: 2.4rem;
    transform: translate3d(-50%, -50%, 0);
    color: inherit;

    & *[fill] {
      fill: currentColor;
    }

    & *[stroke] {
      stroke: currentColor;
    }
  }

  /** pressed effect */
  &:active {
    &:before {
      transform: scale(0.96);
      transition: transform 0.2s;
    }
  }

  /** followed state */
  &.is-followed {
    color: #000;

    &:before {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;
