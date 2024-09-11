import { parseUa } from './uaParse';

const uaMock = {
  iosApp:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 APPPRIZM(os=ios;osVersion=15.0;deviceModel=x86_64;deviceId=5555-1111-2222;appName=PRIZM;appVersion=0.9.0)',
  iosMWeb:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
  iosMWebChrome:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/101.0.4951.58 Mobile/15E148 Safari/604.1',
  aosMWeb:
    'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36',
  pc: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
  instagram:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 118.0.0.25.121 (iPhone11,8; iOS 13_1_3; en_US; en-US; scale=2.00; 828x1792; 180988914)',
};

describe('parseUa', () => {
  it('iOS Prizm APP에서는 다음과 같은 반환형태를 가져야 한다.', () => {
    const act = parseUa(uaMock.iosApp);
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
      isIOS: true,
      isAndroid: false,
      isIOSWebChrome: false,
      isIOSSafari: false,
      isEtcInApp: false,
      isDesktop: false,
      isHeadlessChrome: false,
      isInstagramInApp: false,
      etcInAppBrowser: '',
    });
  });

  it('iOS Chrome Web인 경우에서는 다음과 같은 반환형태를 가져야 한다.', () => {
    const act = parseUa(uaMock.iosMWebChrome);
    expect(act).toEqual({
      isApp: false,
      appInfo: null,
      browser: 'Chrome',
      osVersion: {
        full: '15.4.0',
        major: 15,
        minor: 4,
        patch: 0,
      },
      isMobile: true,
      isIOS: true,
      isAndroid: false,
      isIOSWebChrome: true,
      isIOSSafari: false,
      isEtcInApp: false,
      isDesktop: false,
      isHeadlessChrome: false,
      isInstagramInApp: false,
      etcInAppBrowser: '',
    });
  });

  it('Android Chrome Web인 경우에서는 다음과 같은 반환형태를 가져야 한다.', () => {
    const act = parseUa(uaMock.aosMWeb);
    expect(act).toEqual({
      isApp: false,
      appInfo: null,
      browser: 'Chrome',
      osVersion: {
        full: '10.0.0',
        major: 10,
        minor: 0,
        patch: 0,
      },
      isMobile: true,
      isIOS: false,
      isAndroid: true,
      isIOSWebChrome: false,
      isIOSSafari: false,
      isEtcInApp: false,
      isDesktop: false,
      isHeadlessChrome: false,
      isInstagramInApp: false,
      etcInAppBrowser: '',
    });
  });

  it('instagram webview인 경우 다음과 같은 반환상태를 가져야 한다.', () => {
    const act = parseUa(uaMock.instagram);
    expect(act).toEqual({
      appInfo: null,
      browser: 'Instagram',
      etcInAppBrowser: 'instagram',
      isAndroid: false,
      isApp: false,
      isEtcInApp: true,
      isIOS: true,
      isIOSSafari: false,
      isIOSWebChrome: false,
      isMobile: true,
      isDesktop: false,
      isHeadlessChrome: false,
      isInstagramInApp: true,
      osVersion: { full: '13.1.3', major: 13, minor: 1, patch: 3 },
    });
  });

  it('pc : pc agent에 대한 detect가 정상적으로 진행되어야 한다.', () => {
    const act = parseUa(uaMock.pc).isDesktop;
    expect(act).toEqual(true);
  });
});
