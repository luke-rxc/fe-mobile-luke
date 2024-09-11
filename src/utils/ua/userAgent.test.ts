import { userAgent } from './userAgent';

const uaMock = {
  iosApp:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 APPPRIZM(os=ios;osVersion=15.0;deviceModel=x86_64;deviceId=5555-1111-2222;appName=PRIZM;appVersion=0.9.0)',
  aosApp:
    'Mozilla/5.0 (Linux; Android 11; Android SDK built for x86 Build/RSR1.210210.001.A1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36 APPPRIZM(os=android;osVersion=11;deviceModel=Android SDK built for x86;appName=prizm;appVersion=1.1.3;deviceId=dtTFd_hUTtehEQiL1eSfdx)',
};

describe('userAgent', () => {
  it('iosApp : parseUa에서 도출된 값을 노출해야 한다.', () => {
    const act = userAgent(uaMock.iosApp);
    expect(act).toEqual({
      isApp: true,
      appInfo: {
        appName: 'PRIZM',
        appVersion: '0.9.0',
        appVersionInfo: {
          major: 0,
          minor: 9,
          patch: 0,
        },
        deviceId: '5555-1111-2222',
        deviceModel: 'x86_64',
        os: 'ios',
        osVersion: '15.0',
      },
      browser: '',
      osVersion: {
        full: '15.0.0',
        major: 15,
        minor: 0,
        patch: 0,
      },
      isMobile: true,
      isDesktop: false,
      isIOS: true,
      isAndroid: false,
      isIOSWebChrome: false,
      isIOSSafari: false,
      isEtcInApp: false,
      isHeadlessChrome: false,
      isInstagramInApp: false,
      etcInAppBrowser: '',
    });
  });

  it('aosApp : parseUa에서 도출된 값을 노출해야 한다.', () => {
    const act = userAgent(uaMock.aosApp);
    expect(act).toEqual({
      isApp: true,
      appInfo: {
        appName: 'prizm',
        appVersion: '1.1.3',
        appVersionInfo: {
          major: 1,
          minor: 1,
          patch: 3,
        },
        deviceId: 'dtTFd_hUTtehEQiL1eSfdx',
        deviceModel: 'Android SDK built for x86',
        os: 'android',
        osVersion: '11',
      },
      browser: 'Safari',
      osVersion: {
        full: '11.0.0',
        major: 11,
        minor: 0,
        patch: 0,
      },
      isMobile: true,
      isDesktop: false,
      isIOS: false,
      isAndroid: true,
      isIOSWebChrome: false,
      isIOSSafari: false,
      isEtcInApp: false,
      isHeadlessChrome: false,
      isInstagramInApp: false,
      etcInAppBrowser: '',
    });
  });
});
