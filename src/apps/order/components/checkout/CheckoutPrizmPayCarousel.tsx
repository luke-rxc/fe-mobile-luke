import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { useCallback, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import Swiper from 'swiper';
import { AppLinkTypes } from '@constants/link';
import { CALL_WEB_EVENT } from '@features/prizmPay/constants';
import { DrawerPrizmPayRegisterContainer } from '@features/prizmPay/containers/DrawerPrizmPayRegisterContainer';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useModal } from '@hooks/useModal';
import { useWebInterface } from '@hooks/useWebInterface';
import { CreditCard } from '@pui/creditCard';
import { CreditCardEmpty } from '@pui/creditCardEmpty';
import { SwiperContainer, SwiperContainerProps, SwiperSlide } from '@pui/swiper';
import { toAppLink } from '@utils/link';
import { emitClearReceiveValues } from '@utils/webInterface';
import { CheckoutPrizmPayModel } from '../../models';

interface Props {
  items: CheckoutPrizmPayModel[];
  className?: string;
  onChange?: (card: CheckoutPrizmPayModel) => void;
  onAdd?: () => void;
}

export const CheckoutPrizmPayCarousel = ({ items, className, onChange, onAdd }: Props) => {
  const { isApp, isIOSWebChrome } = useDeviceDetect();
  const { getValues, setValue } = useFormContext();
  const { prizmPayId } = getValues();
  const prizmPayIdRef = useRef<number>(prizmPayId);
  const elRef = useRef<HTMLDivElement>(null);
  const prizmElRef = useRef<(HTMLDivElement & { swiper: Swiper }) | null>(null);
  const { width: screenWidth } = useWindowSize();
  const getPrizmPayIndex = useCallback(
    () =>
      Math.max(
        items.findIndex((item) => item.id === (prizmPayIdRef.current ?? -1)),
        0,
      ),
    [items],
  );
  const prizmPayIndex = getPrizmPayIndex();
  const { receiveValues } = useWebInterface();
  const { openModal } = useModal();
  const swiperOptions: SwiperContainerProps = {
    slidesPerView: 'auto',
    freeMode: false,
    initialSlide: prizmPayIndex,
    watchOverflow: true,
    slideToClickedSlide: true,
    centeredSlides: true,
    ...(screenWidth <= 512 && { centeredSlidesBounds: items.length > 0 }),
    ...(isIOSWebChrome && { cssMode: true }),
  };
  const containerClassName = classNames(className, { 'ios-chrome': isIOSWebChrome });

  function handleChangeSlide(swiper: Swiper) {
    const { activeIndex } = swiper;
    onChange?.(items[activeIndex] ?? null);
    prizmPayIdRef.current = items[activeIndex]?.id;
  }

  async function handleAdd() {
    if (isApp) {
      toAppLink(AppLinkTypes.MANAGE_PAY_REGISTER);
    } else {
      await openModal({
        nonModalWrapper: true,
        render: (props) => <DrawerPrizmPayRegisterContainer {...props} />,
      });
    }
  }

  useEffect(() => {
    if (!prizmElRef.current) {
      const el = elRef.current?.querySelector('.swiper');

      if (el) {
        prizmElRef.current = el as HTMLDivElement & { swiper: Swiper };
      }
    }

    return () => {
      prizmElRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (items) {
      if (!prizmPayId) {
        onChange?.(items[0]);
      }

      if (prizmElRef.current) {
        const index = getPrizmPayIndex();
        prizmElRef.current.swiper.slideTo(index);
        onChange?.(items[index]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    if (!isEmpty(receiveValues)) {
      const { type, data } = receiveValues;

      if (type === CALL_WEB_EVENT.ON_PAY_CLOSE) {
        if (data?.pay) {
          onAdd?.();
          prizmPayIdRef.current = data?.pay.id ?? null;
          setValue('prizmPayId', prizmPayIdRef.current);
        }

        !isApp && emitClearReceiveValues();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  return (
    <div ref={elRef}>
      <SwiperContainerStyled {...swiperOptions} onSlideChange={handleChangeSlide} className={containerClassName}>
        {items.map((item) => {
          return (
            <SwiperSlide key={item.id.toString()} className="pay-slide-item">
              <div className="inner">
                <CreditCard
                  name={item.cardAlias}
                  company={item.cardName}
                  no={item.cardNumber}
                  color={item.color}
                  logoUrl={item.logoPath}
                  className="swiper-prizm-card"
                  badgeLabel={item.badgeLabel}
                  cardLabel={item.cardTypeLabel}
                  disabled={item.disabled}
                />
              </div>
            </SwiperSlide>
          );
        })}
        <SwiperSlide className="pay-slide-item">
          <div className="inner">
            <CreditCardEmpty onClick={handleAdd} className="swiper-prizm-card prizm-card-add-button" />
          </div>
        </SwiperSlide>
      </SwiperContainerStyled>
    </div>
  );
};

const SwiperContainerStyled = styled(SwiperContainer)`
  &.ios-chrome {
    .swiper {
      backface-visibility: hidden;
      transform: translateZ(0);
      transform: translate3d(0, 0, 0);
    }

    & .swiper-wrapper {
      width: auto;
      padding: 0 2.4rem;
    }
  }

  .swiper {
    display: flex;
    flex-direction: column;
    overflow: visible;
    position: relative;

    .inner {
      width: 100%;
    }

    .swiper-prizm-card {
      border-radius: ${({ theme }) => theme.radius.s8};

      .prizm-card {
        border-radius: ${({ theme }) => theme.radius.s8};
      }
    }

    .pay-slide-item {
      width: 24rem;

      .inner {
        transform: scale(0.9, 0.9);
        transition: transform 300ms;
      }

      &.swiper-slide-active {
        .inner {
          transform: scale(1, 1);
        }
      }
    }
  }
`;
