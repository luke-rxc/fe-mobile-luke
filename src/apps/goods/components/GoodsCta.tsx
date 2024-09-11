import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import values from 'lodash/values';
import { useTheme } from '@hooks/useTheme';
import { Button } from '@pui/button';
import { Like as LikeIcon, LikeFilled, Bell, BellFilled as BellFilledIcon } from '@pui/icon';
import { Like, BellFilled } from '@pui/lottie';
import { Floating } from '@features/floating';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { FloatingBannerType } from '@constants/goods';

interface Props {
  isBuyAble: boolean;
  isWishAble: boolean;
  statusText: string;
  hasWishItem: boolean;
  isStatusWait: boolean;
  isNotification: boolean;
  onOptionOpen: () => void;
  onUpdateWish: () => void;
  onUpdateNotification: () => void;
}

const WishIcon: React.FC<{
  hasWishItem: boolean;
  isLottieWish: boolean;
  baseColor: string;
  unWishColor: string;
}> = ({ hasWishItem, isLottieWish, baseColor, unWishColor }) => {
  if (hasWishItem) {
    return isLottieWish ? (
      <>
        <div className="lottie">
          <Like
            animationOptions={{ loop: false }}
            lottieColor={baseColor}
            width="32px"
            height="32px"
            className="lottie-motion"
          />
          <LikeIcon name="like" colorCode={unWishColor} size="32px" className="lottie-bg" />
        </div>
      </>
    ) : (
      <LikeFilled name="likeFilled" colorCode={baseColor} size="32px" />
    );
  }

  return <LikeIcon name="like" colorCode={baseColor} size="32px" />;
};

const BellIcon = ({
  isNotification,
  isLottieBell,
  baseColor,
}: {
  isNotification: boolean;
  isLottieBell: boolean;
  baseColor: string;
}) => {
  if (isNotification) {
    return (
      <>
        {isLottieBell ? (
          <BellFilled animationOptions={{ loop: false }} width="18px" height="18px" />
        ) : (
          <BellFilledIcon name="bellFilled" colorCode={baseColor} size="18px" />
        )}
      </>
    );
  }

  return <Bell name="bell" colorCode={baseColor} size="18px" />;
};

const GoodsCtaComponent: React.FC<Props> = ({
  isBuyAble,
  isWishAble,
  statusText,
  hasWishItem,
  isStatusWait,
  isNotification,
  onOptionOpen: handleOptionOpen,
  onUpdateWish: handleUpdateWish,
  onUpdateNotification: handleUpdateNotification,
}) => {
  const { isApp, isAndroid } = useDeviceDetect();
  const { theme } = useTheme();
  const [isLottieWish, setIsLottieWish] = useState(false);
  const [isLottieBell, setIsLottieBell] = useState(false);

  const handleClick = () => {
    return isStatusWait ? handleUpdateNotification() : handleOptionOpen();
  };

  useEffect(() => {
    if (!hasWishItem) {
      setIsLottieWish(true);
    }
  }, [hasWishItem]);

  useEffect(() => {
    if (!isNotification) {
      setIsLottieBell(true);
    }
  }, [isNotification]);

  return (
    <Wrapper className="is-floating">
      {isWishAble && (
        <Button
          variant="secondary"
          size="large"
          children={
            <WishIcon
              hasWishItem={hasWishItem}
              isLottieWish={isLottieWish}
              baseColor={hasWishItem ? theme.color.semantic.like : theme.color.brand.tint}
              unWishColor={theme.color.brand.tint}
            />
          }
          className={classnames('wish-button', { 'is-aos': isApp && isAndroid })}
          onClick={handleUpdateWish}
          haptic="tapMedium"
        />
      )}

      <Button
        bold
        variant="primary"
        size="large"
        disabled={!isBuyAble}
        children={statusText}
        suffix={
          isStatusWait && (
            <BellIcon
              isNotification={isNotification}
              isLottieBell={isLottieBell}
              baseColor={isNotification ? theme.color.black : theme.color.white}
            />
          )
        }
        className={classnames('shrink purchase', {
          'is-notification is-disabled': isStatusWait && isNotification,
        })}
        onClick={handleClick}
        haptic="tapMedium"
      />
    </Wrapper>
  );
};

export const GoodsCta = ({ onOptionOpen, onUpdateNotification, onUpdateWish, ...props }: Props) => {
  const [floating, setFloating] = useState<boolean>(false);

  /**
   * Floating에서 함수 리렌더링으로 인해 무한루프에 빠지는 이슈로 인해
   * 함수 부분은 따로 ref 참조하는 방식으로 진행
   */
  const eventCallback = useRef({ onOptionOpen, onUpdateNotification, onUpdateWish });

  const handleOptionOpen = () => eventCallback.current.onOptionOpen();
  const handleUpdateNotification = () => eventCallback.current.onUpdateNotification();
  const handleUpdateWish = () => eventCallback.current.onUpdateWish();

  const eventCallbackProps = {
    onOptionOpen: handleOptionOpen,
    onUpdateNotification: handleUpdateNotification,
    onUpdateWish: handleUpdateWish,
  };

  useEffect(() => {
    eventCallback.current = { onOptionOpen, onUpdateNotification, onUpdateWish };
  }, [onOptionOpen, onUpdateNotification, onUpdateWish]);

  useEffect(() => {
    setFloating(true);
  }, []);

  return (
    <Floating id={FloatingBannerType.GOODS_CTA} floating={floating} deps={values(props)}>
      <GoodsCtaComponent {...eventCallbackProps} {...props} />
    </Floating>
  );
};

const Wrapper = styled.div`
  display: flex;

  &.is-floating {
    padding: 0 0.8rem 0.8rem;
  }

  & .wish-button {
    width: 5.6rem;
    margin-right: ${({ theme }) => theme.spacing.s4};
    /** background color: surface, opacity: 0.6 */
    background: ${({ theme }) => (theme.isDarkMode ? 'rgba(32, 32, 32, 0.6)' : 'rgba(255, 255, 255, 0.6)')};
    backdrop-filter: blur(4rem);
    box-shadow: none;

    &.is-aos {
      /** background color: surface, opacity: 0.98 */
      background: ${({ theme }) => (theme.isDarkMode ? 'rgba(32, 32, 32, 0.98)' : 'rgba(255, 255, 255, 0.98)')};
      backdrop-filter: none;
    }

    /* overriding */
    &.is-press:active {
      transform: scale(0.96);
    }
  }
  & .lottie {
    position: relative;
    & .lottie-bg {
      position: absolute;
      top: 0;
      left: 0;
    }
    & .lottie-motion {
      position: relative;
      z-index: 1;
    }
  }
  & .shrink {
    font: ${({ theme }) => theme.fontType.mediumB};
    display: flex;
    flex-shrink: 1;
    width: 100%;
  }

  & .purchase {
    margin-left: ${({ theme }) => theme.spacing.s4};
  }

  ${Button} {
    &:first-of-type {
      margin-left: 0;
    }

    &.is-notification {
      pointer-events: auto !important;
      color: ${({ theme }) => theme.color.brand.tint};
    }
  }

  ${BellFilled} {
    & *[fill] {
      fill: currentColor;
    }
    & *[stroke] {
      stroke: currentColor;
    }
  }
`;
