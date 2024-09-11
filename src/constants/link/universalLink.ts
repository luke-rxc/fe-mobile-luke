/**
 * Universal Link
 *
 * @description Web & App을 통합하여 사용하고자 하는 범용적인 Link입니다.
 */

import { WebLink } from './webLink';
import { AppLink } from './appLink';

export const UniversalLinkTypes = {
  AUTH_SMS: 'AUTH_SMS',
  GOODS: 'GOODS',
  GOODS_CONTENT: 'GOODS_CONTENT',
  GOODS_DETAIL: 'GOODS_DETAIL',
  GOODS_INFO: 'GOODS_INFO',
  GOODS_INFO_TICKET: 'GOODS_INFO_TICKET',
  GOODS_CS: 'GOODS_CS',
  CONTENT: 'CONTENT',
  LIVE: 'LIVE',
  LIVE_AUTH_AUCTION: 'LIVE_AUTH_AUCTION',
  CART: 'CART',
  ORDER_HISTORY: 'ORDER_HISTORY',
  ORDER_DETAIL: 'ORDER_DETAIL',
  CS_NOTICE_LIST: 'CS_NOTICE_LIST',
  CS_NOTICE_DETAIL: 'CS_NOTICE_DETAIL',
  CS_EVENT_LIST: 'CS_EVENT_LIST',
  CS_EVENT_DETAIL: 'CS_EVENT_DETAIL',
  CS_FAQ_LIST: 'CS_FAQ_LIST',
  CS_FAQ_DETAIL: 'CS_FAQ_DETAIL',
  CS_QNA_LIST: 'CS_QNA_LIST',
  CS_QNA_DETAIL: 'CS_QNA_DETAIL',
  CS_QNA_REGISTER_GENERAL: 'CS_QNA_REGISTER_GENERAL',
  CS_QNA_REGISTER_GOODS: 'CS_QNA_REGISTER_GOODS',
  CS_QNA_REGISTER_ORDER: 'CS_QNA_REGISTER_ORDER',
  NOTIFICATIONS: 'NOTIFICATIONS',
  COUPON: 'COUPON',
  COUPON_REGISTER: 'COUPON_REGISTER',
  SHOWROOM: 'SHOWROOM',
  POINT: 'POINT',
  MANAGE_PAY: 'MANAGE_PAY',
  MANAGE_DELIVERY: 'MANAGE_DELIVERY',
  POLICY_TERM: 'POLICY_TERM',
  POLICY_PRIVACY: 'POLICY_PRIVACY',
  POLICY_PRIVACY_PROVIDER: 'POLICY_PRIVACY_PROVIDER',
  AUCTION_POLICY: 'AUCTION_POLICY',
  FINANCE_POLICY: 'FINANCE_POLICY',
  SEARCH: 'SEARCH',
  /** @deprecated 검색 v2 전환 후 제거 예정 */
  SEARCH_RESULT: 'SEARCH_RESULT',
  SEARCH_GOODS_LIST: 'SEARCH_GOODS_LIST',
  SEARCH_SHOWROOM_LIST: 'SEARCH_SHOWROOM_LIST',
  SEARCH_CONTENT_LIST: 'SEARCH_CONTENT_LIST',
  SEARCH_SCHEDULE_LIVE_LIST: 'SEARCH_SCHEDULE_LIVE_LIST',
  HOME: 'HOME',
  MEMBER_AUTH_ADULT: 'MEMBER_AUTH_ADULT',
  SECTION_SHOWROOM: 'SECTION_SHOWROOM',
  SECTION_SHOWROOM_REGION: 'SECTION_SHOWROOM_REGION',
  REVIEW_GOODS_LIST: 'REVIEW_GOODS_LIST',
  REVIEW_LIST: 'REVIEW_LIST',
  REVIEW_DETAIL: 'REVIEW_DETAIL',
  DRAW_GOODS: 'DRAW_GOODS',
  ADDITIONAL_INFO: 'ADDITIONAL_INFO',
  SECTION_GOODS_RECOMMENDATION: 'SECTION_GOODS_RECOMMENDATION',
  SECTION_DISCOVER: 'SECTION_DISCOVER',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type UniversalLinkTypes = ValueOf<typeof UniversalLinkTypes>;

// Content Type
export const ContentLinkTypes = {
  STORY: 'story',
  TEASER: 'teaser',
  EXCLUSIVE: 'exclusive',
  COLLABORATION: 'collaboration',
  EVENT: 'event',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ContentLinkTypes = ValueOf<typeof ContentLinkTypes>;

export const UniversalLink: {
  [k in UniversalLinkTypes]: {
    web: WebLink;
    app: AppLink;
  };
} = {
  [UniversalLinkTypes.AUTH_SMS]: {
    web: WebLink.AUTH_SMS,
    app: AppLink.AUTH_SMS,
  },
  [UniversalLinkTypes.GOODS]: {
    web: WebLink.GOODS,
    app: AppLink.GOODS,
  },
  [UniversalLinkTypes.GOODS_CONTENT]: {
    web: WebLink.GOODS_CONTENT,
    app: AppLink.GOODS_CONTENT,
  },
  [UniversalLinkTypes.GOODS_DETAIL]: {
    web: WebLink.GOODS_DETAIL,
    app: AppLink.GOODS_DETAIL,
  },
  [UniversalLinkTypes.GOODS_INFO]: {
    web: WebLink.GOODS_INFO,
    app: AppLink.GOODS_INFO,
  },
  [UniversalLinkTypes.GOODS_INFO_TICKET]: {
    web: WebLink.GOODS_INFO_TICKET,
    app: AppLink.GOODS_INFO_TICKET,
  },
  [UniversalLinkTypes.GOODS_CS]: {
    web: WebLink.GOODS_CS,
    app: AppLink.GOODS_CS,
  },
  [UniversalLinkTypes.CONTENT]: {
    web: WebLink.CONTENT,
    app: AppLink.CONTENT,
  },
  [UniversalLinkTypes.LIVE]: {
    web: WebLink.LIVE,
    app: AppLink.LIVE,
  },
  [UniversalLinkTypes.LIVE_AUTH_AUCTION]: {
    web: WebLink.LIVE_AUTH_AUCTION,
    app: AppLink.LIVE_AUTH_AUCTION,
  },
  [UniversalLinkTypes.CART]: {
    web: WebLink.CART,
    app: AppLink.BAG,
  },
  [UniversalLinkTypes.ORDER_HISTORY]: {
    web: WebLink.ORDER_HISTORY,
    app: AppLink.ORDER_HISTORY,
  },
  [UniversalLinkTypes.ORDER_DETAIL]: {
    web: WebLink.ORDER_DETAIL,
    app: AppLink.ORDER_DETAIL,
  },
  [UniversalLinkTypes.CS_NOTICE_LIST]: {
    web: WebLink.CS_NOTICE_LIST,
    app: AppLink.CS_NOTICE_LIST,
  },
  [UniversalLinkTypes.CS_NOTICE_DETAIL]: {
    web: WebLink.CS_NOTICE_DETAIL,
    app: AppLink.CS_NOTICE_DETAIL,
  },
  [UniversalLinkTypes.CS_EVENT_LIST]: {
    web: WebLink.CS_EVENT_LIST,
    app: AppLink.CS_EVENT_LIST,
  },
  [UniversalLinkTypes.CS_EVENT_DETAIL]: {
    web: WebLink.CS_EVENT_DETAIL,
    app: AppLink.CS_EVENT_DETAIL,
  },
  [UniversalLinkTypes.CS_FAQ_LIST]: {
    web: WebLink.CS_FAQ_LIST,
    app: AppLink.CS_FAQ_LIST,
  },
  [UniversalLinkTypes.CS_FAQ_DETAIL]: {
    web: WebLink.CS_FAQ_DETAIL,
    app: AppLink.CS_FAQ_DETAIL,
  },
  [UniversalLinkTypes.CS_QNA_LIST]: {
    web: WebLink.CS_QNA_LIST,
    app: AppLink.CS_QNA_LIST,
  },
  [UniversalLinkTypes.CS_QNA_DETAIL]: {
    web: WebLink.CS_QNA_DETAIL,
    app: AppLink.CS_QNA_DETAIL,
  },
  [UniversalLinkTypes.CS_QNA_REGISTER_GENERAL]: {
    web: WebLink.CS_QNA_REGISTER_GENERAL,
    app: AppLink.CS_QNA_REGISTER_GENERAL,
  },
  [UniversalLinkTypes.CS_QNA_REGISTER_GOODS]: {
    web: WebLink.CS_QNA_REGISTER_GOODS,
    app: AppLink.CS_QNA_REGISTER_GOODS,
  },
  [UniversalLinkTypes.CS_QNA_REGISTER_ORDER]: {
    web: WebLink.CS_QNA_REGISTER_ORDER,
    app: AppLink.CS_QNA_REGISTER_ORDER,
  },
  [UniversalLinkTypes.NOTIFICATIONS]: {
    web: WebLink.NOTIFICATIONS,
    app: AppLink.NOTIFICATIONS,
  },
  [UniversalLinkTypes.COUPON]: {
    web: WebLink.COUPON,
    app: AppLink.COUPON,
  },
  [UniversalLinkTypes.COUPON_REGISTER]: {
    web: WebLink.COUPON_REGISTER,
    app: AppLink.COUPON_REGISTER,
  },
  [UniversalLinkTypes.SHOWROOM]: {
    web: WebLink.SHOWROOM,
    app: AppLink.SHOWROOM,
  },
  [UniversalLinkTypes.POINT]: {
    web: WebLink.POINT,
    app: AppLink.POINT,
  },
  [UniversalLinkTypes.MANAGE_PAY]: {
    web: WebLink.MANAGE_PAY,
    app: AppLink.MANAGE_PAY,
  },
  [UniversalLinkTypes.MANAGE_DELIVERY]: {
    web: WebLink.MANAGE_DELIVERY,
    app: AppLink.MANAGE_DELIVERY,
  },
  [UniversalLinkTypes.POLICY_TERM]: {
    web: WebLink.POLICY_TERM,
    app: AppLink.POLICY_TERM,
  },
  [UniversalLinkTypes.POLICY_PRIVACY]: {
    web: WebLink.POLICY_PRIVACY,
    app: AppLink.POLICY_PRIVACY,
  },
  [UniversalLinkTypes.POLICY_PRIVACY_PROVIDER]: {
    web: WebLink.POLICY_PRIVACY_PROVIDER,
    app: AppLink.POLICY_PRIVACY_PROVIDER,
  },
  [UniversalLinkTypes.AUCTION_POLICY]: {
    web: WebLink.AUCTION_POLICY,
    app: AppLink.AUCTION_POLICY,
  },
  [UniversalLinkTypes.FINANCE_POLICY]: {
    web: WebLink.FINANCE_POLICY,
    app: AppLink.FINANCE_POLICY,
  },
  [UniversalLinkTypes.SEARCH]: {
    web: WebLink.SEARCH,
    app: AppLink.SEARCH,
  },
  [UniversalLinkTypes.SEARCH_RESULT]: {
    web: WebLink.SEARCH_RESULT,
    app: AppLink.SEARCH_RESULT,
  },
  [UniversalLinkTypes.SEARCH_GOODS_LIST]: {
    web: WebLink.SEARCH_GOODS_LIST,
    app: AppLink.SEARCH_GOODS_LIST,
  },
  [UniversalLinkTypes.SEARCH_SHOWROOM_LIST]: {
    web: WebLink.SEARCH_SHOWROOM_LIST,
    app: AppLink.SEARCH_SHOWROOM_LIST,
  },
  [UniversalLinkTypes.SEARCH_CONTENT_LIST]: {
    web: WebLink.SEARCH_CONTENT_LIST,
    app: AppLink.SEARCH_CONTENT_LIST,
  },
  [UniversalLinkTypes.SEARCH_SCHEDULE_LIVE_LIST]: {
    web: WebLink.SEARCH_SCHEDULE_LIVE_LIST,
    app: AppLink.SEARCH_SCHEDULE_LIVE_LIST,
  },
  [UniversalLinkTypes.HOME]: {
    web: WebLink.HOME,
    app: AppLink.HOME,
  },
  [UniversalLinkTypes.MEMBER_AUTH_ADULT]: {
    web: WebLink.MEMBER_AUTH_ADULT,
    app: AppLink.MEMBER_AUTH_ADULT,
  },
  [UniversalLinkTypes.SECTION_SHOWROOM]: {
    web: WebLink.SECTION_SHOWROOM,
    app: AppLink.SECTION_SHOWROOM,
  },
  [UniversalLinkTypes.REVIEW_GOODS_LIST]: {
    web: WebLink.REVIEW_GOODS_LIST,
    app: AppLink.REVIEW_GOODS_LIST,
  },
  [UniversalLinkTypes.REVIEW_LIST]: {
    web: WebLink.REVIEW_LIST,
    app: AppLink.REVIEW_LIST,
  },
  [UniversalLinkTypes.REVIEW_DETAIL]: {
    web: WebLink.REVIEW_DETAIL,
    app: AppLink.REVIEW_DETAIL,
  },
  [UniversalLinkTypes.DRAW_GOODS]: {
    web: WebLink.DRAW_GOODS,
    app: AppLink.DRAW_GOODS,
  },
  [UniversalLinkTypes.ADDITIONAL_INFO]: {
    web: WebLink.ADDITIONAL_INFO,
    app: AppLink.ADDITIONAL_INFO,
  },
  [UniversalLinkTypes.SECTION_GOODS_RECOMMENDATION]: {
    web: WebLink.SECTION_GOODS_RECOMMENDATION,
    app: AppLink.SECTION_GOODS_RECOMMENDATION,
  },
  [UniversalLinkTypes.SECTION_DISCOVER]: {
    web: WebLink.SECTION_DISCOVER,
    app: AppLink.SECTION_DISCOVER,
  },
  [UniversalLinkTypes.SECTION_SHOWROOM_REGION]: {
    web: WebLink.SECTION_SHOWROOM,
    app: AppLink.SECTION_SHOWROOM_REGION,
  },
} as const;
