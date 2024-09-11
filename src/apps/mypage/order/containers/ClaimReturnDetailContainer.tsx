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
import { useClaimDetailService } from '../services';
import { Main, Section, EstimatedRefundInfo, OrderGoods, ClaimDetailInfo } from '../components';
import { ClaimManageInfo } from '../constants';

interface UrlParams {
  orderId: string;
}

export const ClaimReturnDetailContainer = () => {
  // URL Parameter
  const { orderId } = useParams<UrlParams>();
  const { toLink, getLink } = useLink();
  const { setTopBar } = useWebInterface();
  const { isApp } = useDeviceDetect();

  const { claimDetailQuery } = useClaimDetailService({ cancelOrReturnId: orderId });
  const {
    data: returnDetailData,
    error: returnDetailError,
    isError: isReturnDetailError,
    isLoading: isReturnDetailLoading,
  } = claimDetailQuery;

  const { title, orderClaimGoods, refundInfo, returnSender, returnMethod, returnReasonItem } = returnDetailData || {};

  const goToOrderHistory = () => {
    toLink(getLink(UniversalLinkTypes.ORDER_HISTORY));
  };

  const loading = useLoadingSpinner(isReturnDetailLoading);

  useEffect(() => {
    if (isApp) {
      setTopBar({
        title: ClaimManageInfo.RETURN_VIEW.actionTitle || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApp]);

  useHeaderDispatch({
    type: 'mweb',
    title: ClaimManageInfo.RETURN_VIEW.actionTitle,
    quickMenus: ['cart', 'menu'],
    enabled: !isReturnDetailLoading,
  });

  if (loading) {
    return null;
  }

  if (isReturnDetailError) {
    return <PageError isFull error={returnDetailError} actionLabel="주문 목록으로 이동" onAction={goToOrderHistory} />;
  }

  return (
    <MainStyled>
      {/* 반품 요청 내역 */}
      {!isApp && <TitleSection title={ClaimManageInfo.RETURN_VIEW.actionTitle} />}
      {orderClaimGoods && title && (
        <Section>
          <TitleSection title={title} />
          <Divider />
          <List className="claim-goods-list" source={orderClaimGoods} component={OrderGoods} />
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
            isCollapseSection
          />
        </SectionDetailStyled>
      )}
      {/* 환불 정보 */}
      {refundInfo && (
        <SectionDetailStyled>
          <EstimatedRefundInfo
            {...refundInfo}
            refundableAmountTitle="환불 금액"
            showReturnShipppingAmount
            isCollapseSection
          />
        </SectionDetailStyled>
      )}
    </MainStyled>
  );
};

const MainStyled = styled(Main)`
  background: ${({ theme }) => theme.color.background.surface};

  .claim-goods-list {
    padding: ${({ theme }) => `${theme.spacing.s12} 0`};
  }
`;

const SectionDetailStyled = styled(Section)`
  padding-top: ${({ theme }) => `${theme.spacing.s12}`};
  background: ${({ theme }) => theme.color.backgroundLayout.section};
`;
