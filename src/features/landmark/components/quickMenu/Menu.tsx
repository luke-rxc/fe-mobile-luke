/* eslint-disable react-hooks/exhaustive-deps */
import styled from 'styled-components';
import { forwardRef, useRef, useEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import { Action, ActionProps } from '@pui/action';
import { Hamburger, LottieRef } from '@pui/lottie';
import { useNavigationState, useNavigationDispatch } from '../../hooks/useNavigation';
import { useLogService } from '../../services/useLogService';

export type MenuProps = Omit<Extract<ActionProps, { is?: 'button' }>, 'is' | 'type'>;

/**
 * 메뉴(햄버거) 버튼
 */
export const Menu = styled(
  forwardRef<HTMLButtonElement, MenuProps>(({ onClick, ...props }, ref) => {
    const lottie = useRef<LottieRef>(null);
    const state = useNavigationState();
    const dispatch = useNavigationDispatch({ enabled: true });
    const { logClickHamburger } = useLogService();

    /**
     * navigation toggle
     */
    const handleToggleNavigation = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      dispatch.merge({ open: !state.open });
      onClick?.(e);

      if (!state.open) {
        logClickHamburger();
      }
    };

    /**
     * lottie toggle animation
     */
    useUpdateEffect(() => {
      const player = lottie.current?.player;

      if (player) {
        player.setDirection(state.open ? 1 : -1);
        player.play();
      }
    }, [state.open]);

    /**
     * lottie initialization
     */
    useEffect(() => {
      const player = lottie.current?.player;

      if (player) {
        player.goToAndStop(state.open ? player.totalFrames : 0, true);
      }
    }, [!!lottie.current]);

    return (
      <Action ref={ref} aria-label="메뉴" onClick={handleToggleNavigation} {...props}>
        <Hamburger ref={lottie} animationOptions={{ loop: false, autoplay: false }} />
        {!!state?.notiCount && !state.open && <span className="badge" />}
      </Action>
    );
  }),
)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 4.8rem;
  height: 4.8rem;

  ${Hamburger} {
    width: 2.4rem;
    height: 2.4rem;

    & *[fill] {
      fill: currentColor;
    }
    & *[stroke] {
      stroke: currentColor;
    }
  }

  .badge {
    ${({ theme }) => theme.mixin.absolute({ t: 8, r: 8 })};
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 0.8rem;
    background: ${({ theme }) => theme.color.red};
  }
`;
