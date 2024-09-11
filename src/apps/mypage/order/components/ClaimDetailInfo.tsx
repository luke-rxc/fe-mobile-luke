import { TitleSub } from '@pui/titleSub';
import styled from 'styled-components';
import { toKRW } from '@utils/toKRW';
import { List } from '@pui/list';
import { ListItemTable } from '@pui/listItemTable';
import { Divider } from '@pui/divider';
import { phoneNumberToString } from '@features/delivery/utils';
import { TitleSection } from '@pui/titleSection';
import { ReasonArea } from './ReasonArea';
import { ClaimCauseTypes, ClaimMethodTypes } from '../constants';
import { CollapseSection } from './CollapseSection';

interface ReturnInfoProps {
  /** 컴포넌트 클래스네임 */
  className?: string;
  /** 반품/교환 사유 */
  claimReasonItem?: {
    code: string;
    text: string;
    cause: {
      code: string;
      name: string;
    };
  };
  /** 배송비 */
  shippingCost?: number;
  /** 반품/교환 방법 */
  claimMethod: {
    code?: string;
    name: string;
  };
  /** 반품/교환 회수지 정보 */
  claimSender?: {
    name: string;
    phone: string;
    address: string;
    addressDetail: string | null;
    postCode?: string;
  } | null;
  /** 귀책 사유명 노출 여부  */
  showReturnCauseName?: boolean;
  /** 반품/교환 여부  */
  claimType?: 'RETURN' | 'EXCHANGE';
  /** Collapse 사용 여부 */
  isCollapseSection?: boolean;
}

const ClaimDetailInfoComponent = ({
  className,
  claimReasonItem,
  shippingCost,
  claimMethod,
  claimSender,
  showReturnCauseName = true,
  claimType = 'RETURN',
  isCollapseSection = false,
}: ReturnInfoProps) => {
  const shippingCostText =
    shippingCost && claimReasonItem?.cause.code === ClaimCauseTypes.PURCHASER
      ? `${toKRW(Math.abs(+shippingCost))} ${showReturnCauseName ? '(구매자 부담)' : ''}`
      : `${showReturnCauseName ? '판매자 부담' : ''}`;
  const shippingCostHiddenCondition =
    (claimReasonItem?.cause.code === ClaimCauseTypes.PURCHASER &&
      shippingCost !== 0 &&
      shippingCost &&
      Math.sign(shippingCost) !== -1) ||
    (!showReturnCauseName && claimReasonItem?.cause.code === ClaimCauseTypes.SELLER && shippingCost === 0);
  const claimTypeText = claimType === 'RETURN' ? '반품' : '교환';
  const paymentText = claimType === 'RETURN' ? '환불금에서 차감' : '계좌이체 (계좌 정보 전달 예정)';
  return isCollapseSection ? (
    <CollapseSection title={`${claimTypeText} 정보`} className={className}>
      <ReasonArea title={`${claimTypeText} 사유`} reasonText={claimReasonItem?.text} />
      <List className={claimMethod.code === ClaimMethodTypes.USER ? 'claim-method' : ''}>
        {!shippingCostHiddenCondition && <ListItemTable titleWidth={80} title="배송비" text={shippingCostText} />}
        {claimReasonItem?.cause.code === ClaimCauseTypes.PURCHASER && (
          <ListItemTable titleWidth={80} title="지불 방법" text={paymentText} />
        )}
        <ListItemTable titleWidth={80} title={`${claimTypeText} 방법`} text={claimMethod.name} />
      </List>
      {claimMethod.code === ClaimMethodTypes.SHOP && (
        <>
          <Divider t="1.2rem" />
          <TitleSub title="회수지" />
          {claimSender && (
            <List className="claim-sender-list">
              <ListItemTable titleWidth={80} title="받는 사람" text={claimSender.name} />
              <ListItemTable titleWidth={80} title="연락처" text={phoneNumberToString(claimSender.phone)} />
              <ListItemTable
                titleWidth={80}
                title="주소"
                text={`${claimSender.address} ${claimSender.addressDetail}`}
              />
            </List>
          )}
        </>
      )}
    </CollapseSection>
  ) : (
    <div className={className}>
      <TitleSection title={`${claimTypeText} 정보`} />
      <ReasonArea title={`${claimTypeText} 사유`} reasonText={claimReasonItem?.text} />
      <List className={claimMethod.code === ClaimMethodTypes.USER ? 'claim-method' : ''}>
        {!shippingCostHiddenCondition && <ListItemTable titleWidth={80} title="배송비" text={shippingCostText} />}
        {claimReasonItem?.cause.code === ClaimCauseTypes.PURCHASER && (
          <ListItemTable titleWidth={80} title="지불 방법" text={paymentText} />
        )}
        <ListItemTable titleWidth={80} title={`${claimTypeText} 방법`} text={claimMethod.name} />
      </List>
      {claimMethod.code === ClaimMethodTypes.SHOP && (
        <>
          <Divider t="1.2rem" />
          <TitleSub title="회수지" />
          {claimSender && (
            <List className="claim-sender-list">
              <ListItemTable titleWidth={80} title="받는 사람" text={claimSender.name} />
              <ListItemTable titleWidth={80} title="연락처" text={phoneNumberToString(claimSender.phone)} />
              <ListItemTable
                titleWidth={80}
                title="주소"
                text={`${claimSender.address} ${claimSender.addressDetail}`}
              />
            </List>
          )}
        </>
      )}
    </div>
  );
};

export const ClaimDetailInfo = styled(ClaimDetailInfoComponent)`
  background: ${({ theme }) => theme.color.background.surface};
  padding-bottom: ${({ theme }) => `${theme.spacing.s12}`};

  .claim-method {
    padding-bottom: ${({ theme }) => `${theme.spacing.s12}`};
  }

  .claim-sender-list {
    padding-bottom: ${({ theme }) => `${theme.spacing.s12}`};
  }
  .collapse-inner {
    padding-bottom: 0;
  }
`;
