import { toPoint } from '../utils';
import { PointSummarySchema } from '../schemas';
import { PointSummaryProps } from '../components';

export type PointSummaryModel = Omit<PointSummaryProps, keyof Omit<React.HTMLAttributes<HTMLDivElement>, 'css'>>;

/**
 * 가용/만료예정 포인트 Model
 *
 * @param PointSummarySchema
 * @returns PointSummaryModel
 */
export const toPointSummaryModel = (schema: PointSummarySchema): PointSummaryModel => {
  const { usablePoint, expirePointDay, expirePointMonth } = schema;

  return {
    savedPoint: toPoint(usablePoint),
    expiresTodayPoint: expirePointDay ? toPoint(expirePointDay) : undefined,
    expiresMonthPoint: expirePointMonth ? toPoint(expirePointMonth) : undefined,
  };
};
