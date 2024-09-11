import debug from '@utils/debug';
import { tracking } from '@utils/log';
import { AppLogTypes, WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../constants/log';

export type CompleteKeywordCouponParams = {
  couponId: number;
  couponName: string;
  couponType: 'CART' | 'GOODS';
  costType: 'PERCENT' | 'WON';
};

export const useLogService = () => {
  /** 마이페이지 > 쿠폰 리스트 진입 */
  const logViewCoupon = () => {
    debug.log(LogEventTypes.LogViewCoupon);

    tracking.logEvent({
      name: LogEventTypes.LogViewCoupon,
      targets: { app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage] },
    });
  };
  /** 마이페이지 > 쿠폰 등록 버튼 탭 */
  const logTabKeywordCoupon = () => {
    debug.log(LogEventTypes.LogTabKeywordCoupon);
    tracking.logEvent({
      name: LogEventTypes.LogTabKeywordCoupon,
      targets: { web: [WebLogTypes.MixPanel], app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage] },
    });
  };

  /** 마이페이지 > 키워드 쿠폰 등록 완료 */
  const logCompleteKeywordCoupon = (parameters: CompleteKeywordCouponParams) => {
    const { couponId, couponName, couponType, costType } = parameters;
    const logParams: {
      coupon_id: string;
      coupon_name: string;
      coupon_type: 'CART' | 'GOODS';
      cost_type: 'PERCENT' | 'WON';
    } = {
      coupon_id: `${couponId}`,
      coupon_name: couponName,
      coupon_type: couponType,
      cost_type: costType,
    };
    debug.log(LogEventTypes.LogCompleteKeywordCoupon, logParams);
    tracking.logEvent({
      name: LogEventTypes.LogCompleteKeywordCoupon,
      parameters: logParams,
      targets: { web: [WebLogTypes.MixPanel], app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage] },
    });
  };

  return {
    logViewCoupon,
    logTabKeywordCoupon,
    logCompleteKeywordCoupon,
  };
};
