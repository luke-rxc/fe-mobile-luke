import React, { useContext, useState, useEffect, HTMLAttributes, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { Button } from '@pui/button';
import { Slot } from '@pui/slot';
import { SlideHandle } from '@features/seat/types';
import classNames from 'classnames';
import { BidCheckoutModel } from '../../models';
import { CheckoutInvalidContext } from '../../contexts/CheckoutInvalidContext';
import { GuideMessages } from './GuideMessages';

interface Props extends HTMLAttributes<HTMLDivElement> {
  checkoutInfo: BidCheckoutModel;
  isLoading?: boolean;
  initialValid?: boolean[];
  onBuy: () => void;
}

export const BidCheckoutBuyButton = ({
  isLoading,
  checkoutInfo,
  initialValid = [false, false, false],
  onBuy,
  className,
  ...rest
}: Props) => {
  const timerElRef = useRef<SlideHandle | null>(null);
  const popupElRef = useRef<HTMLDivElement | null>(null);
  const { isAuthValid, isDeliveryValid, isPayValid } = useContext(CheckoutInvalidContext);
  const {
    formState: { errors, isValid: isValidForm, isDirty },
    trigger,
  } = useFormContext();
  const orderPrice = useWatch({ name: 'orderPrice' });
  const { guideMessages } = checkoutInfo;
  const [valid, setValid] = useState(initialValid.every((v) => v));

  const handleBuy = async () => {
    const isValid = await trigger();

    if (isValid) {
      onBuy();
    }
  };

  const disabled = !valid || !isEmpty(errors) || (isDirty && !isValidForm);

  const handleTransitionEnd = () => {
    timerElRef.current?.play();
  };

  useEffect(() => {
    setValid(isAuthValid && isDeliveryValid && isPayValid);
  }, [isAuthValid, isDeliveryValid, isPayValid]);

  useEffect(() => {
    setTimeout(() => {
      if (popupElRef.current) {
        popupElRef.current.classList.add('active');
      }
    }, 200);
  }, []);

  return (
    <ContainerStyled {...rest} className={classNames(className, { guide: !isEmpty(guideMessages) })}>
      <div className="button-wrapper">
        <div className="mask-field" />
        {guideMessages.length > 0 && (
          <PopupEffect ref={popupElRef} onTransitionEnd={handleTransitionEnd}>
            <GuideMessages ref={timerElRef} messages={guideMessages} />
          </PopupEffect>
        )}
        <div className="button-group">
          <Button
            className="checkout-button"
            bold
            block
            variant="primary"
            size="large"
            disabled={disabled}
            onClick={handleBuy}
            loading={isLoading}
            description={
              disabled ? undefined : (
                <Slot initialValue={0} value={orderPrice ?? checkoutInfo.summaryInfo.orderPrice} suffix="원" />
              )
            }
          >
            결제
          </Button>
        </div>
      </div>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  background: ${({ theme }) => theme.color.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 8rem 2.4rem 0 2.4rem;

  .button-wrapper {
    position: fixed;
    ${({ theme }) => theme.mixin.safeArea('bottom', 24)};
    padding: 0 2.4rem;
    width: 100%;
    ${({ theme }) => theme.mixin.z('cta')}

    & .button-group {
      padding: 0 2.4rem;
    }

    & .checkout-button {
      transition: all 300ms;
    }
  }

  &.guide {
    padding-top: 10.4rem;

    & .button-wrapper {
      bottom: 0;
      padding: 0;

      & .button-group {
        background: ${({ theme }) => theme.color.whiteVariant1};
        padding-bottom: calc(env(safe-area-inset-bottom) + 2.4rem);
      }

      & .mask-field {
        margin-bottom: -0.1rem;
        padding: ${({ theme }) => theme.spacing.s16} 0;
        background: ${({ theme }) =>
          `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${theme.color.whiteVariant1} 100%)`};
      }
    }
  }
`;

type PopupEffectProps = HTMLAttributes<HTMLDivElement>;

const PopupEffectComponent = React.forwardRef<HTMLDivElement, PopupEffectProps>(
  ({ children, onTransitionEnd, ...rest }: PopupEffectProps, ref) => {
    const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
      const el = e.target as HTMLElement;
      const isPopupInnerElement = el.classList.contains('popup-inner');
      isPopupInnerElement && onTransitionEnd?.(e);
    };

    return (
      <div {...rest} ref={ref} onTransitionEnd={handleTransitionEnd}>
        <div className="popup-inner">{children}</div>
      </div>
    );
  },
);

const PopupEffect = styled(PopupEffectComponent)`
  background: ${({ theme }) => theme.color.whiteVariant1};
  height: 3.6rem;

  & > .popup-inner {
    transform: translate3d(0, 3.6rem, 0);
  }

  &.active > .popup-inner {
    transform: translate3d(0, 0, 0);
    transition: transform 200ms;
  }
`;
