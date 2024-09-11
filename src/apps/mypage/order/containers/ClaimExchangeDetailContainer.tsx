import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { UniversalLinkTypes } from '@constants/link';
import { useLink } from '@hooks/useLink';
import { List } from '@pui/list';
import { TitleSection } from '@pui/titleSection';
import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useWebInterface } from '@hooks/useWebInterface';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useEffect } from 'react';
import { Divider } from '@pui/divider';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { phoneNumberToString } from '@features/delivery/utils';
import { useClaimDetailService } from '../services';
import { Main, Section, OrderGoods, ClaimDetailInfo, ShippingInfo, OrderClaimInfo } from '../components';
import { ClaimManageInfo } from '../constants';

interface UrlParams {
  orderId: string;
}

export const ClaimExchangeDetailContainer = () => {
  // URL Parameter
  const { orderId } = useParams<UrlParams>();
  const { toLink, getLink } = useLink();
  const { setTopBar } = useWebInterface();
  const { isApp } = useDeviceDetect();

  const { claimDetailQuery, showChangeShippingAddressModal } = useClaimDetailService({ cancelOrReturnId: orderId });
  const {
    data: exchangeDetailData,
    error: exchangeDetailError,
    isError: isExchangeDetailError,
    isLoading: isExchangeDetailLoading,
  } = claimDetailQuery;

  const {
    title,
    orderClaimGoods,
    refundInfo,
    returnSender,
    returnMethod,
    returnReasonItem,
    recipient,
    isChangeExchangeShippingInfo,
  } = exchangeDetailData || {};

  const goToOrderHistory = () => {
    toLink(getLink(UniversalLinkTypes.ORDER_HISTORY));
  };

  const loading = useLoadingSpinner(isExchangeDetailLoading);

  useEffect(() => {
    if (isApp) {
      setTopBar({
        title: ClaimManageInfo.EXCHANGE_VIEW.actionTitle || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApp]);

  useHeaderDispatch({
    type: 'mweb',
    title: ClaimManageInfo.EXCHANGE_VIEW.actionTitle,
    quickMenus: ['cart', 'menu'],
    enabled: !isExchangeDetailLoading,
  });

  if (loading) {
    return null;
  }

  if (isExchangeDetailError) {
    return (
      <PageError isFull error={exchangeDetailError} actionLabel="주문 목록으로 이동" onAction={goToOrderHistory} />
    );
  }

  return (
    <MainStyled>
      {/* 교환 요청 내역 */}
      {!isApp && <TitleSection title={ClaimManageInfo.EXCHANGE_VIEW.actionTitle} />}
      {orderClaimGoods && title && (
        <Section>
          <TitleSection title={title} />
          <Divider />
          <List
            className="claim-goods-list"
            source={orderClaimGoods}
            getKey={(item) => `${item.id}_${item.itemId}`}
            render={(data) => (
              <>
                <OrderGoods {...data} />
                {data.isExchangeOptions && (
                  <OrderClaimInfoStyled
                    type={data.type}
                    exchangeOptions={data.exchangeOptions}
                    reason={returnReasonItem?.text}
                  />
                )}
              </>
            )}
          />
        </Section>
      )}

      {returnReasonItem && refundInfo && returnMethod && (
        <SectionDetailStyled>
          <ClaimDetailInfo
            claimReasonItem={returnReasonItem}
            shippingCost={refundInfo.shippingAmount}
            claimMethod={returnMethod}
            claimSender={returnSender}
            showReturnCauseName={false}
            claimType="EXCHANGE"
            isCollapseSection
          />
        </SectionDetailStyled>
      )}
      {/* 배송지 정보 */}
      {recipient && (
        <SectionDetailStyled>
          <ShippingInfo
            name={recipient.name}
            address={`${recipient.address} ${recipient.addressDetail}`}
            phoneNumber={phoneNumberToString(recipient.phone)}
            memo={recipient.deliveryRequestMessage}
            isChangeShippingAddress={isChangeExchangeShippingInfo}
            onClickChangeShippingAddress={showChangeShippingAddressModal}
          />
        </SectionDetailStyled>
      )}
    </MainStyled>
  );
};

const MainStyled = styled(Main)`
  background: ${({ theme }) => theme.color.background.surface};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &.is-ios-app {
    min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  }

  .claim-goods-list {
    padding: ${({ theme }) => `${theme.spacing.s12} 0`};
  }
`;

const SectionDetailStyled = styled(Section)`
  padding-top: ${({ theme }) => `${theme.spacing.s12}`};
  background: ${({ theme }) => theme.color.backgroundLayout.section};
`;

const OrderClaimInfoStyled = styled(OrderClaimInfo)`
  margin: ${({ theme }) => `0 ${theme.spacing.s24} ${theme.spacing.s12} ${theme.spacing.s24}`};
`;
