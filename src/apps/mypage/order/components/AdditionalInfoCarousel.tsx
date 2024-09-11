import styled from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useCallback, useRef } from 'react';
import { useWindowSize } from 'react-use';
import { SwiperContainer, SwiperContainerProps, SwiperSlide } from '@pui/swiper';
import classNames from 'classnames';
import { getAppLink } from '@utils/link';
import { AppLinkTypes } from '@constants/link';
import { useModal } from '@hooks/useModal';
import { PassengerCard } from '@pui/passengerCard';
import { useWebInterface } from '@hooks/useWebInterface';
import { useParams } from 'react-router-dom';
import { Swiper } from 'swiper/types';
import { AdditionalInfoOpenProps, AirlineTicketItemModel, OrderDetailUrlParams } from '../types';
import { AdditionalInfoEventType, AdditionalInfoUISectionType, InputFormMode, InputFormType } from '../constants';
import { DrawerAdditionalInfoContainer } from '../containers/DrawerAdditionalInfoContainer';
import { useLogService } from '../services/useLogService';

interface AddionalInfoCarouselProps {
  optionId: number;
  goodsId: number;
  goodsName: string;
  items: AirlineTicketItemModel[];
  isSubmitInputForm: boolean;
  isCompleteInputForm: boolean;
  sectionType: ValueOf<typeof AdditionalInfoUISectionType>;
  inputFormType: keyof typeof InputFormType;
  className?: string;
  onChange?: (card: AirlineTicketItemModel) => void;
  onAdd?: () => void;
}

export const AdditionalInfoCarousel = ({
  optionId,
  goodsId,
  goodsName,
  items,
  isSubmitInputForm,
  isCompleteInputForm,
  sectionType,
  inputFormType,
  className,
}: AddionalInfoCarouselProps) => {
  const { isIOSWebChrome } = useDeviceDetect();
  const { id: orderId } = useParams<OrderDetailUrlParams>();
  const elRef = useRef<HTMLDivElement>(null);
  const { width: screenWidth } = useWindowSize();
  const { openModal } = useModal();
  const { open } = useWebInterface();
  // +탑승자 추가 있을 경우, 변수처리
  const swiperOptions: SwiperContainerProps = {
    slidesPerView: 'auto',
    freeMode: false,
    // eslint-disable-next-line no-nested-ternary
    initialSlide: isCompleteInputForm ? 0 : items.length > 0 ? items.length - 1 : 0,
    spaceBetween: 12,
    watchOverflow: true,
    slideToClickedSlide: true,
    ...(screenWidth <= 512 && { centeredSlidesBounds: items.length > 0 }),
    ...(isIOSWebChrome && { cssMode: true }),
  };
  const containerClassName = classNames(className, {
    'ios-chrome': isIOSWebChrome,
    'is-single-item': (items.length === 0 && !isCompleteInputForm) || (items.length === 1 && isCompleteInputForm),
  });
  const selectedInputMode = isSubmitInputForm ? InputFormMode.COMPLETE : InputFormMode.EDIT;

  const { logMyOrderTabFormInsert, logMyOrderTabFormEdit, logMyOrderTabFormRead } = useLogService();

  const handleOpen = ({ type, mode, initData }: AdditionalInfoOpenProps) => {
    if (mode === InputFormMode.REGISTER) {
      logMyOrderTabFormInsert({
        orderId,
        goodsId,
        goodsName,
        formType: type,
      });
    } else if (mode === InputFormMode.EDIT) {
      logMyOrderTabFormEdit({
        orderId,
        goodsId,
        goodsName,
        formType: type,
        exportId: initData?.data?.exportId,
      });
    } else {
      logMyOrderTabFormRead({
        orderId,
        goodsId,
        goodsName,
        formType: type,
        exportId: initData?.data?.exportId,
      });
    }
    open(
      { url: getAppLink(AppLinkTypes.ADDITIONAL_INFO, { type, mode }), initialData: { initData } },
      {
        doWeb: async () => {
          await openModal(
            {
              nonModalWrapper: true,
              render: (props) => <DrawerAdditionalInfoContainer {...props} type={type} mode={mode} />,
            },
            { initData },
          );
        },
      },
    );
  };

  const handleChangeSlideLength = useCallback(
    (swiper: Swiper) => {
      // eslint-disable-next-line no-nested-ternary
      const slideIndex = isCompleteInputForm ? 0 : items.length > 0 ? items.length - 1 : 0;
      const { params } = swiper;
      if (slideIndex !== params.initialSlide) {
        swiper.slideTo(slideIndex);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.length],
  );

  return (
    <div ref={elRef}>
      <SwiperContainerStyled
        {...swiperOptions}
        className={containerClassName}
        onSlidesLengthChange={handleChangeSlideLength}
      >
        {items.map((item) => {
          return (
            <SwiperSlide key={item.exportId.toString()} className="swiper-additionalInfo-slide-item">
              <div className="inner">
                <PassengerCard
                  name={item.name}
                  dob={item.dob}
                  sex={item.sex}
                  nationality={item.nationality}
                  passportNumber={item.passportNumber}
                  isInfantAccompanied={item.isInfantAccompanied}
                  onClick={() =>
                    handleOpen({
                      type: sectionType,
                      mode: selectedInputMode,
                      initData: {
                        type: AdditionalInfoEventType.ON_OPEN,
                        data: {
                          orderId: Number(orderId),
                          optionId,
                          exportId: item.exportId,
                          inputFormData: item.detailInfo,
                          inputFormType,
                          inputFormMode: selectedInputMode,
                          goodsId,
                          goodsName,
                        },
                      },
                    })
                  }
                />
              </div>
            </SwiperSlide>
          );
        })}
        {!isSubmitInputForm && !isCompleteInputForm && (
          <SwiperSlide className="swiper-additionalInfo-slide-item">
            <div className="inner">
              <PassengerCard
                status="add"
                onClick={() =>
                  handleOpen({
                    type: sectionType,
                    mode: InputFormMode.REGISTER,
                    initData: {
                      type: AdditionalInfoEventType.ON_OPEN,
                      data: {
                        orderId: Number(orderId),
                        optionId,
                        inputFormType,
                        inputFormMode: InputFormMode.REGISTER,
                        goodsId,
                        goodsName,
                      },
                    },
                  })
                }
              />
            </div>
          </SwiperSlide>
        )}
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
      padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
    }
  }

  &.is-single-item {
    & .swiper-wrapper {
      display: flex;
      justify-content: center;
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

    .swiper-additionalInfo-slide-item {
      max-height: 9.6rem;
      max-width: 20.8rem;
      height: 9.6rem;
    }
  }
`;
