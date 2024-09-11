import { GoodsNormalStatusType, GoodsPreOrderStatusType } from '@constants/goods';
import { GoodsSalesSchedulerType } from '../constants';
import { GoodsModel } from '../models';

interface Props {
  /** 상품상세 데이터 */
  detailGoods: GoodsModel | null;
  /** 판매 기간 안내 타입  */
  salesSchedulerType?: GoodsSalesSchedulerType;
  /** 상품(프리오더 or 일반) 준비중에서 타이머에 의해 판매중로 변경되었을 경우 */
  isStatusChange?: GoodsSalesSchedulerType;
  /** 판매 예정 상품에 대해 알림 신청 on으로 변경되었을 경우 */
  isNotification: boolean;
}

export const useCtaService = ({ detailGoods, salesSchedulerType, isStatusChange, isNotification }: Props) => {
  const { isBuyAble, statusText, status, isPrivateSales } = detailGoods ?? {};

  // 판매 예정 상품 체크 (일반 + 프리오더)
  const isStatusActive = !!salesSchedulerType;
  // 일반 상품 판매 예정 상태
  const isNormalWait = salesSchedulerType === GoodsSalesSchedulerType.NORMAL && status === GoodsNormalStatusType.WAIT;
  // 프리오더 판매 예정 상태
  const isPreorderWait =
    salesSchedulerType === GoodsSalesSchedulerType.PREORER && status === GoodsPreOrderStatusType.PREORDER_WAIT;

  const isStatusText = isStatusActive && isNotification ? '알림 받는 중' : statusText ?? '';

  const isSalesScheduleStatusText = isStatusChange === GoodsSalesSchedulerType.NORMAL ? '구매' : isStatusText;
  const isPreorderStatusText = isStatusChange === GoodsSalesSchedulerType.PREORER ? '프리오더 신청' : isStatusText;

  const isCtaStatusText =
    salesSchedulerType === GoodsSalesSchedulerType.PREORER ? isPreorderStatusText : isSalesScheduleStatusText;

  const isStatusWait = (isNormalWait || isPreorderWait) && !isPrivateSales && !isStatusChange;

  return {
    isCtaBuyable: !!isBuyAble,
    isCtaStatusText,
    isStatusWait,
  };
};
