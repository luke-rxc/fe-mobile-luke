import { UniversalLinkTypes, AppLinkTypes } from '@constants/link';
import { getUniversalLink, getAppLink, GetLinkParams } from '@utils/link';
import { userAgent } from '@utils/ua';

/** App/Web용 URL */
export const toUniversalLink: GetLinkParams<UniversalLinkTypes> = (type, params, options) => {
  const { isApp } = userAgent();
  const { app, web } = getUniversalLink(type, params, options);

  return isApp ? app : web;
};

/** 외부 링크 URL */
export const toExternalLink = (url: string, landingType: 'push' | 'model' = 'model') => {
  const { isApp } = userAgent();

  return isApp ? getAppLink(AppLinkTypes.EXTERNAL_WEB, { url, landingType }) : url;
};

interface ToQuestionUrlParams {
  // 주문번호
  orderId: number;
  // 옵션아이디
  optionId: number;
}

/** 1:1 문의 URL */
export const toQuestionUrl = ({ orderId, optionId }: ToQuestionUrlParams) => {
  return toUniversalLink(UniversalLinkTypes.CS_QNA_REGISTER_ORDER, {
    orderId,
    optionId,
  });
};
