import { forwardRef, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { WebLinkTypes } from '@constants/link';
import { useLink } from '@hooks/useLink';
import { useWebInterface } from '@hooks/useWebInterface';
import { Action, ActionProps } from '@pui/action';
import { LottieRef, Bag } from '@pui/lottie';
import { Image } from '@pui/image';
import { useLogService } from '@features/landmark/services/useLogService';
import { getImageLink } from '@utils/link';
import { useNavigationState } from '../../hooks/useNavigation';

export type CartProps = Omit<Extract<ActionProps, { is?: 'a' }>, 'is' | 'link' | 'type'> & {
  imagePath?: string;
};

/**
 * 쇼핑백(Cart) 아이콘
 * @TODO 링크 연결
 */
export const Cart = styled(
  forwardRef<HTMLAnchorElement, CartProps>(({ imagePath, ...props }, ref) => {
    const { getLink } = useLink();
    const { logClickCart } = useLogService();
    const { cartCount } = useNavigationState();
    const { emitCartItemUpdated, cartItemUpdatedValues } = useWebInterface();

    const lottieRef = useRef<LottieRef>(null);

    const [isCart, setIsCart] = useState<boolean>(!!cartCount);

    const path = imagePath && getImageLink(imagePath);

    const handleClick = () => {
      logClickCart();
    };

    const handleTransitionEnd = (e: React.TransitionEvent) => {
      if (e.propertyName !== 'transform') {
        return;
      }

      if (cartItemUpdatedValues?.isAdded) {
        emitCartItemUpdated({ isAdded: false });
        return;
      }

      lottieRef.current?.player?.goToAndPlay(0);
    };

    useEffect(() => {
      if (!cartItemUpdatedValues?.isAdded) {
        return;
      }

      setIsCart(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartItemUpdatedValues]);

    return (
      <Action
        ref={ref}
        is="a"
        link={getLink(WebLinkTypes.CART)}
        aria-label="쇼핑백"
        {...props}
        onClick={handleClick}
        onTransitionEnd={handleTransitionEnd}
      >
        <Bag ref={lottieRef} width="2.4rem" height="2.4rem" animationOptions={{ autoplay: false, loop: false }} />
        {/* 카트 담기와 로그인했을 경우 분기처리(카트 담기 애니메이션 O, 로그인시 애니메이션 X) */}
        <span className={classnames('badge', { 'is-cart': isCart, 'is-login': !!cartCount })} />

        {path && (
          <Image
            src={path}
            width="4.4rem"
            height="4.4rem"
            className={classnames({ 'is-active': cartItemUpdatedValues?.isAdded })}
          />
        )}
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

  ${Bag} {
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
    opacity: 0;

    &.is-cart {
      opacity: 1;
      transition: opacity 0.2s ease-in 1.2s;
    }

    &.is-login {
      opacity: 1;
    }
  }

  ${Image} {
    ${({ theme }) => theme.mixin.absolute({ t: 2, r: 2 })};
    border-radius: 0.8rem;
    transform: scale(0);
    transition: transform 0.5s cubic-bezier(0.88, 0, 0.84, 0.53) 0.2s;

    &.is-active {
      transform: scale(1);
      transition: transform 0.2s ease-out;
    }
  }
`;
