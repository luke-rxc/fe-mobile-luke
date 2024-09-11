/* eslint-disable react/no-array-index-key */
import { GoodsOptions } from '@pui/orderGoodsListItem/v2';
import styled from 'styled-components';

export interface OrderClaimInfoProps {
  type?: 'cancel' | 'return' | 'exchange';
  reason?: string;
  orderOptions?: string[];
  exchangeOptions?: string[][];
  className?: string;
}

/** 취교반 정보 */
export const OrderClaimInfo = styled(({ type, reason, exchangeOptions, className }: OrderClaimInfoProps) => {
  // 취소
  if (type === 'cancel') {
    return (
      <div className={className}>
        <div className="title">취소 사유</div>
        <div className="reason" children={reason} />
      </div>
    );
  }

  // 반품
  if (type === 'return') {
    return (
      <div className={className}>
        <div className="title">반품 사유</div>
        <div className="reason" children={reason} />
      </div>
    );
  }

  // 교환
  if (type === 'exchange') {
    return (
      <div className={className}>
        {exchangeOptions && exchangeOptions[0].length > 1 ? (
          <div>
            <div className="title">교환 옵션</div>
            <div className="reason">
              <div className="reason-item">
                <div>{exchangeOptions && <GoodsOptions options={exchangeOptions[0]} />}</div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="title">교환 사유</div>
            <div className="reason" children={reason} />
          </div>
        )}
      </div>
    );
  }

  return null;
})`
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.s16};
  border-radius: ${({ theme }) => theme.radius.r8};
  background: ${({ theme }) => theme.color.brand.tint3};

  .title {
    font: ${({ theme }) => theme.fontType.smallB};
    color: ${({ theme }) => theme.color.text.textPrimary};
  }

  .reason {
    margin-top: ${({ theme }) => theme.spacing.s4};
    font: ${({ theme }) => theme.fontType.small};
    color: ${({ theme }) => theme.color.text.textTertiary};
  }

  .reason-item {
    display: flex;
  }
`;
