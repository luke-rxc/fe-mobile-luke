import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { useAuth } from '@hooks/useAuth';
import { PageError } from '@features/exception/components';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { REFETCH_RECEIVE_TYPES } from '../constants';
import { AuthButton, AuthComplete } from '../components';
import { useAuthLogService } from '../services';

type ReceiveDataType = {
  type?: string;
};

export const LiveAuthAuctionContainer = () => {
  const { liveId } = useParams<{ liveId?: string }>();
  const [mounted, setMounted] = useState(false);
  const { isApp, isIOS, osVersion } = useDeviceDetect();
  const { paymentInfoRegistrationCompleted, receiveValues } = useWebInterface();
  const { isLoading, userInfo, refetchUserInfo } = useAuth();
  const logService = useAuthLogService();

  // 상단 여백 예외처리 대상 디바이스 여부
  const isExtraMarginDevice = isIOS && osVersion?.major === 14;

  // 본인 인증, 배송지 추가, 카드 추가
  const {
    isIdentify = false,
    hasShippingAddress = false,
    hasPrizmPay = false,
    isPrizmPayReRegistrationRequired = false,
  } = userInfo ?? {};

  // 주문자 정보 추가 여부
  const [addedIdentify, setAddedIdentify] = useState(isIdentify);
  // 배송지 추가 여부
  const [addedShippingAddress, setAddedShippingAddress] = useState(hasShippingAddress);
  // 카드 추가 여부
  const [addedPrizmPay, setAddedPrizmPay] = useState(hasPrizmPay);
  // 카드 재등록 케이스 여부
  const [isReRegistration, setIsReRegistration] = useState(isPrizmPayReRegistrationRequired);

  /**
   * 기존 PG사 카드만 가지고 있는 경우
   *
   * @description
   * 1.등록된 카드가 1개도 없는경우
   *   hasPrizmPay : false, isPrizmPayReRegistrationRequired: false
   * 2. 기존 pg사만 가지고 있는 경우
   *   hasPrizmPay : false, isPrizmPayReRegistrationRequired: true
   * 3. 토스페이먼츠 등록한경우
   *   hasPrizmPay : true, isPrizmPayReRegistrationRequired: false
   */
  const hasOnlyOldPrizmPay = !addedPrizmPay && isPrizmPayReRegistrationRequired;

  // 입찰 필수 정보 입력 완료
  const isCompleted = isIdentify && hasShippingAddress && hasPrizmPay;

  // 완료 클릭
  const handleCompleted = () => {
    logService.logLiveTabAuctionRequiredDone(liveId);
    paymentInfoRegistrationCompleted();
  };

  useEffect(() => {
    logService.logLiveViewAuctionRequired(liveId);
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // isPrizmPayReRegistrationRequired가 true로 들어온 이력 유지를 위한 처리
    isPrizmPayReRegistrationRequired && setIsReRegistration(true);
  }, [isPrizmPayReRegistrationRequired]);

  useEffect(() => {
    if (!isEmpty(receiveValues)) {
      const { type = '' } = receiveValues as ReceiveDataType;

      switch (type) {
        case 'onSMSAuthClose':
          setAddedIdentify(true);
          break;
        case 'onDeliveryClose':
          setAddedShippingAddress(true);
          break;
        case 'onPayClose':
          setAddedPrizmPay(true);
          break;
        default:
          break;
      }

      REFETCH_RECEIVE_TYPES.includes(type) && refetchUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  const loading = useLoadingSpinner(isLoading || !mounted);

  if (loading) {
    return null;
  }

  // Error
  if (!isApp || !userInfo) {
    return <PageError isFull />;
  }

  return (
    <ContainerStyled>
      <ButtonGroupStyled {...(isExtraMarginDevice ? { extraMarginTop: '1.2rem' } : {})}>
        <AuthButton
          text="주문자 정보"
          done={addedIdentify}
          linkType="AUTH_SMS"
          onClick={() => logService.logLiveTabAuctionRequiredIdentify(liveId)}
        />
        <AuthButton
          text="배송지 추가"
          done={addedShippingAddress}
          linkType="MANAGE_DELIVERY_REGISTER"
          onClick={() => logService.logLiveTabAuctionRequiredShipping(liveId)}
        />
        <AuthButton
          text={isReRegistration ? '카드 재등록' : '카드 추가'}
          done={addedPrizmPay}
          linkType="MANAGE_PAY_REGISTER"
          description={hasOnlyOldPrizmPay && '기존 카드 사용 불가'}
          onClick={() => logService.logLiveTabAuctionRequiredPrizmPay(liveId)}
        />
      </ButtonGroupStyled>
      <AuthComplete isCompleted={isCompleted} onClick={handleCompleted} />
    </ContainerStyled>
  );
};

const ButtonGroupStyled = styled.div<{ extraMarginTop?: string }>`
  display: flex;
  flex-direction: column;
  padding: 1.2rem 0;

  /* 상단 여백 추가 */
  ${({ extraMarginTop }) => extraMarginTop && `margin-top: ${extraMarginTop};`}

  ${AuthButton} {
    margin-bottom: 1.2rem;
  }

  ${AuthButton}:last-child {
    margin-bottom: 0;
  }
`;

const ContainerStyled = styled.div`
  background: ${({ theme }) => theme.color.surface};
  display: flex;
  flex-direction: column;
  padding: 0 2.4rem;
`;
