import { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';
import classnames from 'classnames';
import { useLiveCouponIndicatorStore } from '../store';

interface Props {
  className?: string;
  children: ReactNode;
}

export const CouponIndicator = ({ className, children }: Props) => {
  const showCouponIndicator = useLiveCouponIndicatorStore((state) => state.showCouponIndicator);
  const downloadableCouponStatus = useLiveCouponIndicatorStore((state) => state.downloadableCouponStatus);
  const isShow = downloadableCouponStatus === 'show' || downloadableCouponStatus === 'show-again';

  return (
    <WrapperStyled
      className={classnames(className, {
        [downloadableCouponStatus]: isShow ? showCouponIndicator : true,
      })}
    >
      <span className="coupon">COUPON</span>
      {children}
    </WrapperStyled>
  );
};

const showScale = keyframes`
  0% { transform: scale(1) }
  50% { transform: scale(0.9) }
  100% { transform: scale(1) }
`;
const hideScale = keyframes`
  0% { transform: scale(1) }
  49.9% { transform: scale(0.9) }
  100% { transform: scale(1) }
`;

const couponShowScale = keyframes`
  0% { transform: scale(1) }
  34% { transform: scale(0.75, 1) translate3d(0, 0, 0) }
  66% { transform: scale(1) translate3d(0, 2.2rem, 0) }
  100% { transform: scale(1) translate3d(0, 2rem, 0) }
`;
const couponHideScale = keyframes`
  0% { transform: scale(1) translate3d(0, 2.2rem, 0) }
  33% { transform: scale(0.75, 1) translate3d(0, 2.2rem, 0) }
  66% { transform: scale(1) translate3d(0, 0, 0) }
  100% { transform: scale(1) }
`;
const couponOpacityHide = keyframes`
  0% { opacity: 1; transform: translate3d(0, 2rem, 0) }
  99% { opacity: 0; transform: translate3d(0, 2rem, 0) }
  100% { opacity: 0; transform: translate3d(0, 2rem, 0) }
`;

const show = keyframes`
  0% { opacity: 0; }
  99% { opacity: 0; }
  100% { opacity: 1; }
`;

const hide = keyframes`
  0% { opacity: 0; }
  98% { opacity: 0; }
  100% { opacity: 1; }
`;

const couponOpacityShow = keyframes`
  0% { opacity: 0; transform: translate3d(0, 2rem, 0) }
  100% { opacity: 1; transform: translate3d(0, 2rem, 0) }
`;

const WrapperStyled = styled.span`
  > div {
    will-change: transform, opacity;
  }

  > span.coupon {
    ${({ theme }) => theme.mixin.absolute({ t: 46, l: 0, r: 0 })};
    transform: translate3d(0, 0, 0);
    font: ${({ theme }) => theme.fontType.micro};
    opacity: 1;
    color: ${({ theme }) => theme.color.whiteLight};
  }

  &.show {
    > div {
      animation: ${showScale} 0.35s forwards;
      animation-delay: 0.45s;
    }

    > span.coupon {
      animation: ${couponShowScale} 0.5s ease-in-out forwards;
      animation-delay: 0.45s;
    }

    &.view-standard {
      .auction {
        animation: ${show} 0.35s;
        animation-delay: 0.35s;
      }
    }

    &.view-auction {
      .standard {
        animation: ${show} 0.35s;
        animation-delay: 0.35s;
      }
    }
  }

  &.show-again {
    > span.coupon {
      opacity: 0;
      transform: translate3d(0, 2rem, 0);
      animation: ${couponOpacityShow} 0.35s ease-in-out forwards;
    }
  }

  &.hide {
    > div {
      animation: ${hideScale} 0.35s forwards;
    }

    > span.coupon {
      animation: ${couponHideScale} 0.5s ease-in-out forwards;
    }

    &.view-standard {
      .auction {
        animation: ${hide} 0.35s;
      }
    }

    &.view-auction {
      .standard {
        animation: ${hide} 0.35s;
      }
    }
  }

  &.opacity-hide {
    > span.coupon {
      animation: ${couponOpacityHide} 0.35s ease-in-out forwards;
    }
  }
`;
