/**
 * Branch Log & Universal Link 연동 진행
 * @see https://www.notion.so/rxc/Branch-13872edc8b26492b960f20b95e65152b
 * @since 2023.01.18
 * @author jeff@rxc.co.kr
 */

import qs from 'qs';
import env from '@env';
import { userAgent } from '@utils/ua';
import { createDebug } from '@utils/debug';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    branch: any;
  }
}

const debug = createDebug('tracking:branch');
const { isApp, isIOS } = userAgent();
const { authKey, app, endPoint } = env;

/* Cspell:disable */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const init = (cb?: () => any) => {
  if (isApp) {
    return;
  }

  if (window.branch) {
    cb?.();
    return;
  }

  /* eslint-disable */
  (function (b: any, r: any, a: any, n: any, c: any, h: any, _: any, s: any, d?: any, k?: any) {
    if (!b[n] || !b[n]._q) {
      for (; s < _.length; ) c(h, _[s++]);
      d = r.createElement(a);
      d.async = 1;
      d.src = 'https://cdn.branch.io/branch-latest.min.js';
      d.onload = function () {
        debug.log('onload', authKey.branch);

        // Branch Init
        window.branch.init(authKey.branch, (err: string, data: any) => {
          debug.log('init LoadComplete', err, data);
        });
        return cb ? cb() : void 0;
      };
      k = r.getElementsByTagName(a)[0];
      k.parentNode.insertBefore(d, k);
      b[n] = h;
    }
  })(
    window,
    document,
    'script',
    'branch',
    function (b: any, r: any) {
      b[r] = function () {
        b._q.push([r, arguments]);
      };
    },
    { _q: [], _v: 1 },
    'addListener applyCode autoAppIndex banner closeBanner closeJourney creditHistory credits data deepview deepviewCta first getCode init link logout redeem referrals removeListener sendSMS setBranchViewData setIdentity track validateCode trackCommerceEvent logEvent disableTracking qrCode'.split(
      ' ',
    ),
    0,
  );
  /* eslint-enable */
};

/**
 * @reference https://help.branch.io/developers-hub/docs/web-full-reference#logeventevent-event_data_and_custom_data-content_items-customer_event_alias-callback
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logEvent = (eventName: string, customData?: Record<string, any>) => {
  init(() => {
    debug.log('logEvent', eventName, customData);
    window.branch.logEvent(eventName, customData);
  });
};

/**
 * @reference https://help.branch.io/developers-hub/docs/connected-advanced-features#initialize-branch-features
 */
interface BranchInitDataSchema {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data_parsed: Record<string, any> | null;
  identity: string | null;
  referring_link: string | null;
  referring_identity: string | null;
  has_app?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBranchData = (): Promise<BranchInitDataSchema | null> => {
  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.branch.data((err: string, data: BranchInitDataSchema) => {
      resolve(err ? null : data);
    });
  });
};

/**
 * @reference https://help.branch.io/using-branch/docs/creating-a-deep-link
 * @reference link Data : https://help.branch.io/developers-hub/docs/web-full-reference
 */
export type GenerateOneLinkOptionProps = {
  channel?: string;
  feature?: string;
  campaign?: string;
  stage?: string;
};
interface GenerateOneLinkProps {
  deepLinkPath: string;
  linkOptions?: GenerateOneLinkOptionProps;
}

const BaseWebDefaultValue = 'web_to_app';

/**
 * 분석을 위한 로깅 설정
 * @see https://www.notion.so/rxc/8bfb1aef752940bfad2a7200dfa34b3f?pvs=4#ba3e2c742fb74ef493817dd0b52c963c
 */
type ReturnValuesGenerateOneLinkBranchURL = {
  appLink: string;
  logParameters: {
    query_channel: string | null;
    query_feature: string | null;
    query_campaign: string | null;
    query_ad_name: string | null;
    query_ad_set_name: string | null;
    current_web_url: string;
    branch_channel: string | null;
    branch_feature: string | null;
    branch_campaign: string | null;
    branch_referring_link: string | null;
    branch_ad_name: string | null;
    branch_ad_set_name: string | null;
    branch_api_complete: boolean;
    link_channel: string;
    link_feature: string;
    link_campaign: string;
    link_ad_name: string;
    link_ad_set_name: string;
    referrer_web_url: string | null;
  };
};

export const generateOneLinkBranchURL = async ({
  deepLinkPath,
  linkOptions,
}: GenerateOneLinkProps): Promise<ReturnValuesGenerateOneLinkBranchURL> => {
  const {
    channel = BaseWebDefaultValue,
    feature = BaseWebDefaultValue,
    campaign = BaseWebDefaultValue,
    stage,
  } = linkOptions ?? {};

  const queryParseData = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  const {
    utm_source: utmSource,
    utm_campaign: utmCampaign,
    utm_medium: utmMedium,
    '~ad_name': qsAdName,
    '~ad_set_name': qsAdSetName,
  } = queryParseData;

  /** scheme을 제외한 딥링크 */
  const deepLink = `${app.host}${deepLinkPath.split(app.host)[1]}`;
  const branchData = await getBranchData();
  const {
    '~campaign': branchApiDataCampaign,
    '~channel': branchApiDataChannel,
    '~feature': branchApiDataFeature,
    '~ad_name': branchApiDataAdName,
    '~ad_set_name': branchApiDataAdSetName,
    '~referring_link': branchApiDataReferringLink,
    $marketing_title: branchApiDataMarketingTitle,
  } = branchData?.data_parsed ?? {};
  const hasBranchDataParsed = !!branchData?.data_parsed;

  debug.log('link Generator: queryParseData -', queryParseData);
  debug.log('link Generator: branchData -', branchData);

  return new Promise((resolve) => {
    const linkRequiredData = {
      channel: utmSource ?? branchApiDataChannel ?? channel,
      feature: utmMedium ?? branchApiDataFeature ?? feature,
      campaign: utmCampaign ?? branchApiDataCampaign ?? campaign,
      adName: qsAdName ?? branchApiDataAdName ?? BaseWebDefaultValue,
      adSetName: qsAdSetName ?? branchApiDataAdSetName ?? BaseWebDefaultValue,
    };

    /** 분석을 위한 로깅 설정 */
    const logParameters: ReturnValuesGenerateOneLinkBranchURL['logParameters'] = {
      query_channel: (utmSource as string) ?? null,
      query_feature: (utmMedium as string) ?? null,
      query_campaign: (utmCampaign as string) ?? null,
      query_ad_name: (qsAdName as string) ?? null,
      query_ad_set_name: (qsAdSetName as string) ?? null,
      current_web_url: window.location.href,
      branch_channel: branchApiDataChannel ?? null,
      branch_feature: branchApiDataFeature ?? null,
      branch_campaign: branchApiDataCampaign ?? null,
      branch_referring_link: branchApiDataReferringLink ?? null,
      branch_ad_name: branchApiDataAdName ?? null,
      branch_ad_set_name: branchApiDataAdSetName ?? null,
      branch_api_complete: hasBranchDataParsed,
      link_channel: linkRequiredData.channel,
      link_feature: linkRequiredData.feature,
      link_campaign: linkRequiredData.campaign,
      link_ad_name: linkRequiredData.adName,
      link_ad_set_name: linkRequiredData.adSetName,
      referrer_web_url: window.document.referrer || null,
    };

    debug.log('link Generator: linkRequiredData -', linkRequiredData);

    window.branch.link(
      {
        channel: linkRequiredData.channel,
        feature: linkRequiredData.feature,
        campaign: linkRequiredData.campaign,
        ...(stage ? { stage } : {}),
        data: {
          /**
           * 딥링크 설정, Scheme 제외
           * @example prizm.co.kr/showroom/kapka
           */
          $deeplink_path: deepLink,
          $canonical_identifier: deepLink,
          /** deferred deeplink를 위한 필수 설정 */
          $is_deferred_deeplink: true,
          /** 광고나 공유받은 퀵링크를 통해 진입 후 성과가 끊어지지 않고 어트리뷰션 되기위해서 웹에서 앱설치 유도하는 링크에서는 의도적으로 어트리뷰션을 하지 않도록 설정이 필요 */
          $deeplink_no_attribution: false,
          /** Redirect 수준 설정, 0(표준) ~ 2(강제) */
          $url_redirect_mode: '1',
          /** 웹 URL */
          $desktop_url: endPoint.pcBaseUrl,
          $ios_url: app.iosAppStoreUrl,
          $ipad_url: app.iosAppStoreUrl,
          $android_url: app.aosAppStoreUrl,
          /** 유저가 앱이나 Store에서 다시 브라우저로 돌아올때, IOS Only */
          $after_click_url: window.location.href,
          /** Marketing Custom */
          '~ad_name': linkRequiredData.adName,
          '~ad_set_name': linkRequiredData.adSetName,
          $marketing_title: branchApiDataMarketingTitle ?? BaseWebDefaultValue,
        },
      },
      (error: Error, appLink: string) => {
        /**
         * @returns e.g. https://prizminhouse.app.link/KByrnQ86hAb
         */
        debug.log('[generateOneLinkBranchURL] appLink: ', appLink);
        debug.log('[generateOneLinkBranchURL] error: ', error);
        debug.log('[generateOneLinkBranchURL] logParameters: ', logParameters);
        const appStoreUrl = isIOS ? app.iosAppStoreUrl : app.aosAppStoreUrl;
        resolve({
          appLink: appLink ?? appStoreUrl,
          logParameters,
        });
      },
    );
  });
};
/* Cspell:enable */
