import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { HTMLAttributes, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';
import { PGType } from '@constants/order';
import { PrizmPayEventBanner, PrizmPayEventBannerProps } from '@features/prizmPay/components';
import { BannerModel } from '@features/prizmPay/models';
import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { PaymentListGroup } from '@pui/paymentList';
import { Select, Option } from '@pui/select';
import { TitleSection } from '@pui/titleSection';

import { BenefitDescription } from './BenefitDescription';
import { CheckoutPrizmPayCarousel } from './CheckoutPrizmPayCarousel';
import { DEFAULT_MINIMUM_INSTALLMENT_AMOUNT } from '../../constants';
import { CheckoutInvalidContext } from '../../contexts/CheckoutInvalidContext';
import { CheckoutPrizmPayModel, PaymentType } from '../../models';

export interface CheckoutPayment2Props extends HTMLAttributes<HTMLDivElement> {
  selectedType: PGType | null;
  paymentTypeList: PaymentType[];
  prizmPayList: CheckoutPrizmPayModel[];
  isShowInstallmentDropdown: boolean;
  bannerList: BannerModel[];
  summaryElRef?: RefObject<HTMLDivElement>;
  onEventBannerClick: PrizmPayEventBannerProps['onClick'];
  onPayAdd?: () => void;
  onPaymentMethodChange?: (paymentType: PGType) => void;
}

const PRIZM_PAY_DESCRIPTION = `프리즘페이로는 할부 결제를 이용하실 수 없습니다`;

const PRIZM_PAY_GROUP_ID = 1;

export const CheckoutPayment = ({
  selectedType,
  paymentTypeList: paymentTypeListOrigin,
  prizmPayList,
  onPayAdd: handleAdd,
  isShowInstallmentDropdown,
  className,
  bannerList,
  summaryElRef,
  onEventBannerClick: handleEventBannerClick,
  onPaymentMethodChange: handlePaymentMethodChange,
  ...rest
}: CheckoutPayment2Props) => {
  const { userInfo } = useAuth();
  const isShowBanner =
    prizmPayList.every((pay) => pay.isDeprecated) &&
    (userInfo?.isPrizmPayReRegistrationRequired ?? false) &&
    bannerList.length > 0;
  const { updateIsPayValid } = useContext(CheckoutInvalidContext);
  const { setValue, register, getValues } = useFormContext();
  const { isIOSWebChrome } = useDeviceDetect();
  const paymentTypeList = useMemo(
    () =>
      paymentTypeListOrigin.map((item) => {
        const description = !isEmpty(item.benefitList) ? (
          <BenefitDescription benefitList={item.benefitList} />
        ) : undefined;
        return {
          ...item,
          description,
        };
      }),
    [paymentTypeListOrigin],
  );
  const paymentGroupList = paymentTypeList.filter((item) => item.pgType !== PGType.PRIZM_PAY);
  const prizmPayGroupList = paymentTypeList
    .filter((item) => item.pgType === PGType.PRIZM_PAY)
    .map((type) => {
      if (type.pgType === PGType.PRIZM_PAY) {
        return { ...type, label: isShowBanner ? '카드 재등록' : type.label };
      }

      return type;
    });
  const initialSelectedGroupId = selectedType !== PGType.PRIZM_PAY ? 0 : PRIZM_PAY_GROUP_ID;
  const initialSelectedItemIndex = paymentGroupList.findIndex((item) => item.pgType === selectedType);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(initialSelectedGroupId);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(Math.max(initialSelectedItemIndex, 0));
  const orderPrice = Number(useWatch({ name: 'orderPrice' }));
  const [options, setOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >(prizmPayList[0]?.installmentFreeMonthList ?? []);
  const minimumInstallmentAmountRef = useRef<number>(DEFAULT_MINIMUM_INSTALLMENT_AMOUNT);
  const collapseElRef = useRef<HTMLDivElement>(null);
  const isPrizmPayUnderAmount = selectedGroupId === 1 && orderPrice < minimumInstallmentAmountRef.current;
  const { prizmPayId } = getValues();
  const currentPrizmPay = prizmPayList.find((pay) => pay.id === prizmPayId);
  const installmentDisabled =
    isPrizmPayUnderAmount || currentPrizmPay?.disabled || !currentPrizmPay?.isPossibleInstallment;
  const [displayPrizmPay, setDisplayPrizmPay] = useState<boolean>(selectedGroupId === PRIZM_PAY_GROUP_ID);
  const collapseClass = classNames(className);
  const eventBannerClass = classNames('event-banner', {
    hide: orderPrice === 0,
    show: orderPrice !== 0,
  });
  const prizmPayElRef = useRef<HTMLDivElement | null>(null);
  const prizmPayElMaxHeightRef = useRef<number>(0);
  const carouselWrapperElRef = useRef<HTMLDivElement>(null);
  const isUsePrizmPay = prizmPayGroupList.length > 0;
  const summaryElHeight = summaryElRef?.current?.offsetHeight ?? 0;
  const prizmPayContentClass = classNames('prizm-pay-content');
  const containerClass = classNames({ 'ios-chrome': isIOSWebChrome });

  const setInstallmentPlan = (pay?: CheckoutPrizmPayModel) => {
    if (!pay) {
      setOptions([]);
      return;
    }

    if (!pay.isPossibleInstallment) {
      minimumInstallmentAmountRef.current = Number.POSITIVE_INFINITY;
      setOptions([{ label: '일시불', value: 1 }]);
      return;
    }

    minimumInstallmentAmountRef.current = pay.minimumPaymentAmount;
    setOptions(pay.installmentFreeMonthList);
  };

  const isValidPay = (pay?: CheckoutPrizmPayModel) => {
    if (!pay) {
      return false;
    }

    const id = pay.id || null;
    const { disabled } = pay;

    if (!id) {
      return false;
    }

    if (disabled) {
      return false;
    }

    return true;
  };

  const validatePaymentGroup = (groupId: number) => {
    if (orderPrice === 0) {
      updateIsPayValid(true);
      return;
    }

    const { payType } = getValues();
    const pay = prizmPayList.find((item) => item.id === prizmPayId);
    const isValid = groupId === PRIZM_PAY_GROUP_ID ? isValidPay(pay) : !!payType;
    updateIsPayValid(isValid);
  };

  const handleSelectGroup = useCallback(
    (groupId: number, itemIndex: number) => {
      setSelectedGroupId(groupId);
      setSelectedItemIndex(itemIndex);
      setDisplayPrizmPay(groupId === PRIZM_PAY_GROUP_ID);

      const payType = [paymentGroupList, prizmPayGroupList][groupId][itemIndex].pgType;
      handlePaymentMethodChange?.(payType);
      setValue('payType', payType);
      validatePaymentGroup(groupId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paymentTypeList, prizmPayId, prizmPayList],
  );

  const updateInstallmentPlanStyle = () => {
    const wrapperEl = carouselWrapperElRef.current?.querySelector('.plan-select-wrapper');
    const selectEl = carouselWrapperElRef.current?.querySelector('.plan-select');

    if (options.length === 0) {
      selectEl?.classList.add('hide');
      wrapperEl?.classList.add('hide');
      return;
    }

    wrapperEl?.classList.remove('hide');
    selectEl?.classList.remove('hide');
  };

  const updatePrizmPayElementMaxHeight = useCallback(() => {
    window.requestAnimationFrame(() => {
      const el = prizmPayElRef.current;

      if (el) {
        if (!displayPrizmPay) {
          el.style.maxHeight = '0';
          carouselWrapperElRef.current?.classList.remove('show');
          return;
        }

        const height = carouselWrapperElRef.current?.offsetHeight ?? 0;
        const maxHeight = Math.max(prizmPayElMaxHeightRef.current, height);
        prizmPayElMaxHeightRef.current = maxHeight;
        el.style.maxHeight = `${maxHeight}px`;
        carouselWrapperElRef.current?.classList.add('show');
      }
    });
  }, [displayPrizmPay]);

  const handlePrizmPayChange = (pay: CheckoutPrizmPayModel) => {
    setValue('prizmPayId', pay?.id ?? null);
    setValue('cardInstallmentPlan', 1);
    setInstallmentPlan(pay);

    if (selectedGroupId === PRIZM_PAY_GROUP_ID) {
      const isValid = isValidPay(pay);
      updateIsPayValid(isValid);
    }
  };

  useEffect(() => {
    if (orderPrice === 0) {
      window.requestAnimationFrame(() => {
        collapseElRef.current?.classList.add('hide');
      });
      collapseElRef.current?.classList.remove('show');
    } else {
      window.requestAnimationFrame(() => {
        collapseElRef.current?.classList.add('show');
      });
      collapseElRef.current?.classList.remove('hide');
    }

    validatePaymentGroup(selectedGroupId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderPrice]);

  useEffect(() => {
    isPrizmPayUnderAmount && setValue('cardInstallmentPlan', 1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPrizmPayUnderAmount]);

  useEffect(() => {
    updatePrizmPayElementMaxHeight();
  }, [updatePrizmPayElementMaxHeight]);

  useEffect(() => {
    updateInstallmentPlanStyle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    if (prizmPayList.length === 0) {
      setValue('prizmPayId', null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prizmPayList]);

  return (
    <CollapseEffectStyled className={collapseClass} height={summaryElHeight} ref={collapseElRef}>
      <ContainerStyled {...rest} className={containerClass}>
        <TitleSection title="결제 수단" />
        <div className="payment-content">
          <div className="prizm-pay-group-list">
            <div className="prizm-pay-group">
              <PaymentListGroup
                list={paymentGroupList}
                groupId={0}
                selected={selectedGroupId === 0}
                selectedItemIndex={selectedItemIndex}
                onSelect={handleSelectGroup}
              />
            </div>
            {isUsePrizmPay && (
              <>
                <div className="prizm-pay-group">
                  <PaymentListGroup
                    list={prizmPayGroupList}
                    groupId={PRIZM_PAY_GROUP_ID}
                    selected={selectedGroupId === PRIZM_PAY_GROUP_ID}
                    onSelect={handleSelectGroup}
                  />
                </div>
                <div className={prizmPayContentClass} ref={prizmPayElRef}>
                  <div className="carousel-wrapper" ref={carouselWrapperElRef}>
                    <CheckoutPrizmPayCarousel
                      className="prizm-pay-carousel"
                      items={prizmPayList}
                      onAdd={handleAdd}
                      onChange={handlePrizmPayChange}
                    />
                    {isShowInstallmentDropdown ? (
                      <div
                        className="plan-select-wrapper"
                        onTransitionEnd={(e) => {
                          if (e.propertyName === 'padding-bottom') {
                            updatePrizmPayElementMaxHeight();
                          }
                        }}
                      >
                        <Select
                          {...register('cardInstallmentPlan', {
                            valueAsNumber: true,
                          })}
                          disabled={installmentDisabled}
                          size="medium"
                          className="plan-select"
                          placeholder={options.length === 0 ? '일시불' : ''}
                        >
                          {options.map((month) => {
                            return (
                              <Option key={month.label} value={month.value}>
                                {month.label}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                    ) : (
                      prizmPayId && <p className="prizm-pay-description">{PRIZM_PAY_DESCRIPTION}</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </ContainerStyled>
      {isShowBanner && selectedGroupId === PRIZM_PAY_GROUP_ID && (
        <PrizmPayBannerContainerStyled>
          <PrizmPayEventBannerStyled className={eventBannerClass} list={bannerList} onClick={handleEventBannerClick} />
        </PrizmPayBannerContainerStyled>
      )}
    </CollapseEffectStyled>
  );
};

const CollapseEffectStyled = styled.div<{ height: number }>`
  overflow: hidden;
  position: relative;

  &.show {
    height: 100%;
    z-index: 0;
  }

  &.hide {
    height: ${({ height }) => `${height}px`};
    overflow: hidden;
    touch-action: none;
    pointer-events: none;
    z-index: 0;

    &.section {
      margin-bottom: 0;
    }
  }
`;

const ContainerStyled = styled.div`
  background: ${({ theme }) => theme.color.surface};
  overflow: hidden;

  ${PaymentListGroup} {
    &:first-child {
      z-index: 0;
    }
  }

  .payment-content {
    position: relative;
    padding-bottom: 2.4rem;
  }

  .prizm-pay-group {
    &:first-child {
      margin-bottom: 1.2rem;
    }

    padding: 0 2.4rem;
  }

  .prizm-pay-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 250ms ease-out;
  }

  .prizm-pay-carousel {
    padding: 0 2.4rem;
    padding-top: ${({ theme }) => theme.spacing.s24};
  }

  &.ios-chrome {
    .prizm-pay-carousel {
      padding-left: 0;
      padding-right: 0;
    }
  }

  .carousel-wrapper {
    touch-action: none;
    pointer-events: none;
    transition: opacity 400ms;

    &.show {
      touch-action: auto;
      pointer-events: all;
    }
  }

  .plan-select-wrapper {
    position: relative;
    padding-bottom: 4rem;
    transition: padding-bottom 200ms;
    margin-top: 2rem;

    &.hide {
      padding-bottom: 0;
      margin-top: 0;
    }
  }

  .plan-select {
    position: absolute;
    padding: 0 2.4rem;

    opacity: 1;
    transform: translateY(0);
    transition: opacity 150ms, transform 200ms;

    &.hide {
      opacity: 0;
      transform: translateY(-2.4rem);
      touch-action: none;
      pointer-events: none;
    }
  }

  .prizm-pay-description {
    margin-top: 2rem;
    padding: 1.2rem 2.4rem;
    text-align: center;
    color: ${({ theme }) => theme.color.gray50};
    font: ${({ theme }) => theme.fontType.t10};
    white-space: pre-line;
  }
`;

const PrizmPayBannerContainerStyled = styled.div`
  background: ${({ theme }) => theme.color.bg};
`;

const PrizmPayEventBannerStyled = styled(PrizmPayEventBanner)`
  padding: 1.2rem 2.4rem;
  padding-top: 0;

  &.show {
    opacity: 1;
    transition: opacity 1s ease-in;
  }

  &.hide {
    position: absolute;
    z-index: -1;
    opacity: 0;
    visibility: hidden;
    transition: visibility 0.5s, opacity 0.1s linear;
    touch-action: none;
    pointer-events: none;
  }
`;
