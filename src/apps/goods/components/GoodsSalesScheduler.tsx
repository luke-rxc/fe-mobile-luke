import React from 'react';
import styled from 'styled-components';
import type { useDDay } from '@services/useDDay';
import { CountDown } from '@pui/countDown';
import { Divider } from '@pui/divider';
import { GoodsNormalStatusType, GoodsPreOrderStatusType } from '@constants/goods';
import { GoodsModel, OptionModel } from '../models';

interface Props {
  /** 판매 시작일 */
  salesStartDate: string;
  /** 판매 종료일 */
  salesEndDate?: string;
  /** 카운트다운 활성화 여부 */
  enabledCountDown: boolean;
  /** 카운트 다운, useDDay */
  ddayProps: ReturnType<typeof useDDay>;
  /** 상품 판매 상태 */
  status: GoodsModel['status'];
  /** 프리오더 상품 */
  isPreorder: boolean;
  /** 프리오더 준비중 -> 판매 상태로 변경된 경우 */
  isPreorderChange: boolean;
  /** 수량 제한 상품 여부 */
  isInfinity: OptionModel['totalStock']['isInfinity'];
  /** 판매수량 */
  purchasableEa: number;
}

export const GoodsSalesScheduler = ({
  isPreorder,
  salesStartDate,
  salesEndDate,
  enabledCountDown,
  ddayProps,
  status,
  isInfinity,
  isPreorderChange,
  purchasableEa,
}: Props) => {
  const { isEnd, remainDay, countDown } = ddayProps;

  const prefix = isPreorder ? '프리오더' : '판매';
  const title = salesEndDate ? `${prefix} 기간` : `${prefix} 시작일`;
  const showCountDown =
    enabledCountDown && (status === GoodsPreOrderStatusType.PREORDER || status === GoodsNormalStatusType.NORMAL);

  return (
    <Wrapper>
      <PeriodStyled>
        <div className="info-area">
          <p className="title">{title}</p>
          <p className="date">
            {salesStartDate}
            {salesEndDate}
          </p>
        </div>
        {showCountDown && (
          <CountDown
            remainDay={remainDay}
            countDown={countDown}
            countDownEnd={isEnd}
            nearTimeSize={24}
            direction="right"
          />
        )}
      </PeriodStyled>
      {isPreorder && !isInfinity && (
        <>
          {(status === GoodsPreOrderStatusType.PREORDER_WAIT || status === GoodsPreOrderStatusType.PREORDER) && (
            <Divider />
          )}

          <StockStyled>
            {status === GoodsPreOrderStatusType.PREORDER_WAIT && !isPreorderChange && (
              <p className="stock">{purchasableEa}개 한정</p>
            )}
            {(status === GoodsPreOrderStatusType.PREORDER || isPreorderChange) && (
              <p className="stock">잔여 수량 {purchasableEa}개</p>
            )}
          </StockStyled>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: ${({ theme }) => theme.color.background.bg};
`;

const PeriodStyled = styled.div`
  padding: 1.85rem 2.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & .info-area {
    & .title {
      color: ${({ theme }) => theme.color.text.textTertiary};
      font: ${({ theme }) => theme.fontType.mini};
    }

    & .date {
      font-size: ${({ theme }) => theme.fontSize.s14};
      line-height: 1.7rem;
    }

    .title + .date {
      margin-top: ${({ theme }) => theme.spacing.s4};
    }
  }
`;

const StockStyled = styled.div`
  padding: 0 2.4rem;

  & .stock {
    padding: 1.55rem 0;
    text-align: center;
    font: ${({ theme }) => theme.fontType.smallB};
    line-height: 1.7rem;
  }
`;
