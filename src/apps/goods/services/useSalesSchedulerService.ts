import { useEffect, useState } from 'react';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { GoodsType, GoodsPreOrderStatusType, GoodsNormalStatusType } from '@constants/goods';
import { useDDay } from '@services/useDDay';
import { GoodsModel, OptionModel } from '../models';
import { GoodsSalesSchedulerType } from '../constants';
import { toDateFormatWithLocale } from '../utils';

interface Props {
  detailGoods: GoodsModel | null;
  totalStock: OptionModel['totalStock'] | null;
}

const MONTH_DATE = 'M. d(iii)';
const YEAR_MONTH_DATE = `yyyy. ${MONTH_DATE}`;
const HOUR = 'a h시';
const HOUR_MINUTE = `${HOUR} m분`;

const getSchedulerType = (detailGoods: GoodsModel | null): GoodsSalesSchedulerType | undefined => {
  if (detailGoods === null) {
    return undefined;
  }

  const { type, status, salesEndDate } = detailGoods;

  // 프리오더 상품
  if (
    type === GoodsType.PREORDER &&
    (status === GoodsPreOrderStatusType.PREORDER_WAIT ||
      status === GoodsPreOrderStatusType.PREORDER ||
      status === GoodsPreOrderStatusType.PREORDER_RUNOUT)
  ) {
    return GoodsSalesSchedulerType.PREORER;
  }

  // 일반 상품
  if (type === GoodsType.NORMAL) {
    // 판매 예정
    if (status === GoodsNormalStatusType.WAIT) {
      return GoodsSalesSchedulerType.NORMAL;
    }

    // 판매중
    if (status === GoodsNormalStatusType.NORMAL) {
      if (!salesEndDate) {
        return undefined;
      }

      const now = new Date().getTime();
      const caluRemainDay = differenceInCalendarDays(salesEndDate, now);

      // D-7 보다 많이 남았을 경우 판매 기간 UI 미노출
      if (caluRemainDay > 7) {
        return undefined;
      }

      return GoodsSalesSchedulerType.NORMAL;
    }
  }

  return undefined;
};

export const useSalesSchedulerService = ({ detailGoods, totalStock }: Props) => {
  const [isStatusChange, setIsStatusChange] = useState<GoodsSalesSchedulerType>();
  const salesSchedulerType = getSchedulerType(detailGoods);

  const { status } = detailGoods ?? {};

  const salesStartDate = detailGoods?.salesStartDate ?? 0;
  const salesEndDate = detailGoods?.salesEndDate ?? 0;
  const purchasableEa = totalStock?.purchasableEa ?? 0;

  const now = new Date().getTime();
  const caluRemainDay = differenceInCalendarDays(salesEndDate, now);

  // D-7 보다 많이 남았을 경우 카운트다운 X
  const enabledCountDown = !!salesSchedulerType && !!detailGoods?.salesEndDate && caluRemainDay <= 7;

  // 판매 시작 전 상태 (일반, 프리오더)
  const isStatusWait = status === GoodsNormalStatusType.WAIT || status === GoodsPreOrderStatusType.PREORDER_WAIT;

  const time = isStatusWait ? salesStartDate : salesEndDate;
  const ddayProps = useDDay({ time, enabled: enabledCountDown });

  const { isEnd, countDown } = ddayProps;

  const currentYear = new Date().getFullYear();
  const startYear = new Date(salesStartDate).getFullYear();
  const endYear = new Date(salesEndDate).getFullYear();

  const startDateFormat = currentYear === startYear ? MONTH_DATE : YEAR_MONTH_DATE;
  const endDateFormat = startYear === endYear ? MONTH_DATE : YEAR_MONTH_DATE;
  const timeFormat = new Date(salesStartDate).getMinutes() === 0 ? HOUR : HOUR_MINUTE;

  // Date Display
  const salesStart = isStatusWait
    ? toDateFormatWithLocale(salesStartDate, `${startDateFormat} ${timeFormat}`)
    : toDateFormatWithLocale(salesStartDate, startDateFormat);
  const salesEnd = !isStatusWait && salesEndDate ? ` ~ ${toDateFormatWithLocale(salesEndDate, endDateFormat)}` : '';

  /** 프리오더 준비중에서 카운트 다운이 끝났을때, 프리오더 상태를 판매상태로 변경 */
  useEffect(() => {
    /**
     * @issue isEnd 으로만 진행해도 무방하나, 렌더링 되기 전 Data Set시에 isEnd 가 true 인 경우도 있어, countDown 까지 이중 체크 진행
     */
    if (
      status === GoodsPreOrderStatusType.PREORDER_WAIT &&
      salesSchedulerType === GoodsSalesSchedulerType.PREORER &&
      !isStatusChange &&
      isEnd &&
      countDown <= 0
    ) {
      setIsStatusChange(GoodsSalesSchedulerType.PREORER);

      return;
    }

    /** 판매 예정(WAIT)에서 카운트 다운이 끝났을 경우, 판매 예정(WAIT) 상태를 판매중(NORMAL)로 변경 */
    if (
      status === GoodsNormalStatusType.WAIT &&
      salesSchedulerType === GoodsSalesSchedulerType.NORMAL &&
      !isStatusChange &&
      isEnd &&
      countDown <= 0
    ) {
      setIsStatusChange(GoodsSalesSchedulerType.NORMAL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, salesSchedulerType, isEnd, countDown]);

  return {
    salesSchedulerType,
    enabledCountDown,
    isStatusChange,
    salesStart,
    salesEnd,
    ddayProps,
    purchasableEa,
  };
};
