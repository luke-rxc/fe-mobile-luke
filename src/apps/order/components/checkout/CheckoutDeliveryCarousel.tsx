import classNames from 'classnames';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import Swiper from 'swiper';
import { AppLinkTypes } from '@constants/link';
import { DrawerDeliveryRegisterContainer } from '@features/delivery/containers/DrawerDeliveryRegisterContainer';
import { DeliveryModel } from '@features/delivery/models';
import { CALL_WEB_EVENT_TYPE } from '@features/delivery/constants';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useModal } from '@hooks/useModal';
import { useWebInterface } from '@hooks/useWebInterface';
import { AddressCard } from '@pui/addressCard';
import { Plus } from '@pui/icon';
import { SwiperContainer, SwiperContainerProps, SwiperSlide } from '@pui/swiper';
import { getAppLink } from '@utils/link';
import { emitClearReceiveValues } from '@utils/webInterface';
import { CheckoutOrdererInfoModel } from '../../models';

interface Props {
  deliveryList: DeliveryModel[];
  className?: string;
  orderer: CheckoutOrdererInfoModel;
  onChange?: (card: DeliveryModel) => Promise<void>;
  onAdd?: () => void;
}

export const CheckoutDeliveryCarousel = ({ className, deliveryList, orderer, onChange, onAdd }: Props) => {
  const { isApp } = useDeviceDetect();
  const deliveryIdRef = useRef<number | null>(deliveryList.find((delivery) => delivery.isDefault)?.id ?? null);
  const elRef = useRef<(HTMLDivElement & { swiper: Swiper }) | null>(null);
  const getDeliveryIndex = useCallback(
    () =>
      Math.max(
        deliveryList.findIndex((delivery) => delivery.id === deliveryIdRef.current),
        0,
      ),
    [deliveryList],
  );
  const deliveryIndex = getDeliveryIndex();
  const prevDeliveryIndexRef = useRef(-1);
  const [activeIndex, setActiveIndex] = useState(deliveryIndex);
  const debouncedChange = debounce(
    (index: number) =>
      onChange?.(deliveryList[index] ?? null)
        .then(() => {
          prevDeliveryIndexRef.current = index;
        })
        .catch(() => {
          const { current: prevIndex } = prevDeliveryIndexRef;
          elRef?.current?.swiper.slideTo(prevIndex);
          setActiveIndex(prevIndex);
        }),
    500,
  );

  const handleChange = (index: number) => {
    setActiveIndex(index);
    debouncedChange(index);
  };

  const { width: screenWidth } = useWindowSize();
  const { receiveValues, open } = useWebInterface();
  const { openModal } = useModal();
  const swiperOptions: SwiperContainerProps = {
    slidesPerView: 'auto',
    freeMode: false,
    spaceBetween: 12,
    initialSlide: deliveryIndex,
    watchOverflow: true,
    slideToClickedSlide: true,
    centeredSlides: deliveryList.length === 0 || screenWidth > 512,
    touchRatio: 0.8,
  };

  const handleChangeSlide = useCallback(
    (swiper: Swiper) => {
      const { activeIndex: index } = swiper;
      handleChange(index);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deliveryList],
  );

  const handleAdd = useCallback(() => {
    const { name, phone } = orderer;

    open(
      {
        url: getAppLink(AppLinkTypes.MANAGE_DELIVERY_REGISTER),
        initialData: { type: CALL_WEB_EVENT_TYPE.ON_DELIVERY_ORDERER_SYNC, data: { name, phone } },
      },
      {
        doWeb: async () => {
          await openModal(
            {
              nonModalWrapper: true,
              render: (props) => <DrawerDeliveryRegisterContainer {...props} />,
            },
            { type: CALL_WEB_EVENT_TYPE.ON_DELIVERY_ORDERER_SYNC, data: { name, phone } },
          );
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApp, orderer]);

  useEffect(() => {
    if (!elRef.current) {
      const [el] = Array.from(document.querySelectorAll('.swiper'));
      elRef.current = el as HTMLDivElement & { swiper: Swiper };
    }

    return () => {
      elRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (prevDeliveryIndexRef.current > -1) {
      if (elRef.current) {
        const index = getDeliveryIndex();
        elRef.current.swiper.slideTo(index);

        if (prevDeliveryIndexRef.current === deliveryIndex) {
          handleChange(deliveryIndex);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryList, getDeliveryIndex]);

  useEffect(() => {
    if (!isEmpty(receiveValues)) {
      const { type, data } = receiveValues;

      if (type === CALL_WEB_EVENT_TYPE.ON_DELIVERY_CLOSE) {
        if (data?.delivery) {
          deliveryIdRef.current = data.delivery.id;
          if (deliveryList.length === 0) {
            prevDeliveryIndexRef.current = 0;
          }
          onAdd?.();
        }

        !isApp && emitClearReceiveValues();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  return (
    <SwiperContainerStyled {...swiperOptions} className={className} onSlideChange={handleChangeSlide}>
      {deliveryList.map((delivery, index) => (
        <SwiperSlide key={delivery.id.toString()} className="delivery-slide-item">
          <div className="inner">
            <PressedEffectStyled>
              <AddressCard
                role="button"
                className="delivery-item"
                name={delivery.name}
                phone={delivery.phone}
                address={delivery.address}
                addressDetail={delivery.addressDetail}
                active={index === activeIndex}
              />
            </PressedEffectStyled>
          </div>
        </SwiperSlide>
      ))}
      <SwiperSlide>
        <div className="inner">
          <PressedEffectStyled>
            <DeliveryAddButtonStyled role="button" onClick={handleAdd} className="delivery-add-button">
              <Plus size="2.4rem" color="gray50" />
              <span className="btn-title">추가</span>
            </DeliveryAddButtonStyled>
          </PressedEffectStyled>
        </div>
      </SwiperSlide>
    </SwiperContainerStyled>
  );
};

const SwiperContainerStyled = styled(SwiperContainer)`
  .swiper {
    display: flex;
    flex-direction: column;
    overflow: visible;
    flex-direction: column;

    .swiper-slide {
      width: 24rem;
      border-radius: ${({ theme }) => theme.radius.s8};
      transform: translate3d(0, 0, 0);
    }

    .inner {
      width: 100%;
    }
  }
`;

const DeliveryAddButtonStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 24rem;
  max-height: 10.6rem;
  width: 100%;
  height: 10.6rem;
  border: 0.1rem solid ${({ theme }) => theme.color.gray8};
  border-radius: ${({ theme }) => theme.radius.s8};
  background: ${({ theme }) => theme.color.surface};

  & .btn-title {
    margin-top: 0.4rem;
    font: ${({ theme }) => theme.fontType.t14};
    color: ${({ theme }) => theme.color.gray50};
  }
`;

type PressEffectStyledProps = HTMLAttributes<HTMLDivElement>;

const PressedEffectStyled = styled(({ children, ...rest }: PressEffectStyledProps) => {
  const [pressed, setPressed] = useState(false);
  const className = classNames(rest.className, { 'is-press': pressed });

  const handlePressStart = useCallback(() => {
    setPressed(true);
  }, []);

  const handlePressEnd = useCallback(() => {
    setPressed(false);
  }, []);

  return (
    <div
      {...rest}
      className={className}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressEnd}
    >
      {children}
    </div>
  );
})`
  & > [role='button'] {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      content: '';
    }
  }

  &.is-press {
    & > [role='button'] {
      &::before {
        opacity: 0.03;
        background: ${({ theme }) => theme.color.black};
        border-radius: inherit;
        border: inherit;
        transition: background 200ms;
      }
    }
  }
`;
