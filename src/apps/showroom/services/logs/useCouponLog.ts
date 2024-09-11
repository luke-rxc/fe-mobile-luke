import debug from '@utils/debug';
import { tracking } from '@utils/log';
import { AppLogTypes, WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../../constants';
import { MultipleCouponDownloadSchema } from '../../schemas';

export const useCouponLog = () => {
  /**
   * 쿠폰 다운로드(성공) 로깅
   */
  const logCouponDownload = (params: MultipleCouponDownloadSchema['downloadedCouponList']) => {
    const parameters = params.reduce<{ [key in string]: (string | number)[] }>(
      (acc, coupon) => ({
        coupon_id: [...acc.coupon_id, coupon.couponId],
        coupon_name: [...acc.coupon_name, coupon.display?.name],
        coupon_type: [...acc.coupon_type, coupon.useType],
        cost_type: [...acc.cost_type, coupon.salePolicy?.costType],
      }),
      { coupon_id: [], coupon_name: [], coupon_type: [], cost_type: [] },
    );

    debug.log(LogEventTypes.LogCouponDownload, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogCouponDownload,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  return { logCouponDownload };
};
