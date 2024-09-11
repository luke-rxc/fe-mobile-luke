/**
 * Call App (Web -> App) LogEvent, LogUser Type
 * - 호출할 로그 서비스 (type)
 * @see {@link https://www.notion.so/rxc/Web-Interface-b55be04d1f4a4013851b6534f56d5a78}
 */
export const AppLogTypes = {
  Firebase: 'firebase',
  Facebook: 'facebook',
  MixPanel: 'mixpanel',
  MoEngage: 'moengage',
  Branch: 'branch',
  Prizm: 'prizm',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AppLogTypes = ValueOf<typeof AppLogTypes>;

/**
 * Web Log Type
 */
export const WebLogTypes = {
  MixPanel: 'mixpanel',
  KakaoPixel: 'kakaoPixel',
  GoogleAds: 'googleAds',
  Branch: 'branch',
  Facebook: 'facebook',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type WebLogTypes = ValueOf<typeof WebLogTypes>;

/**
 * App User Log Type
 */
export const AppUserLogTypes = {
  Firebase: 'firebase',
  Facebook: 'facebook',
  MixPanel: 'mixpanel',
  MoEngage: 'moengage',
  Branch: 'branch',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AppUserLogTypes = ValueOf<typeof AppUserLogTypes>;

/**
 * Web User Log Type
 */
export const WebUserLogTypes = {
  MixPanel: 'mixpanel',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type WebUserLogTypes = ValueOf<typeof WebUserLogTypes>;
