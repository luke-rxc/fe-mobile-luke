export type AppVersionType = {
  major: number;
  minor: number;
  patch: number;
};

export type AppInfoType = {
  appName: string;
  appVersion: string;
  appVersionInfo: AppVersionType;
  deviceModel: string;
  deviceId: string;
  os: string;
  osVersion: string;
};

export type DeviceOsVersion = {
  full: string;
  major: number;
  minor?: number;
  patch?: number;
};

export type AgentValue = {
  isApp: boolean;
  appInfo: AppInfoType | null;
  browser: string;
  isEtcInApp: boolean;
  etcInAppBrowser: string;
  osVersion: DeviceOsVersion | null;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  isIOSWebChrome: boolean;
  isIOSSafari: boolean;
  isInstagramInApp: boolean;
  isHeadlessChrome: boolean;
};
