import {
  getIsAndroid,
  getIsIOS,
  getAppInfo,
  getOsVersion,
  getBrowser,
  getEtcInAppBrowser,
  /**
   * @todo userAgentData 는 서비스 적용시 테스트 코드 정비 (리펙토링 필요)
    getBrowserForList,
    getWebkitForList,
    getWebkit,
    hasUserAgentData,
  */
} from './uaUtils';

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

describe('uaUtils', () => {
  /** getAppInfo */
  describe('getAppInfo', () => {
    it('모바일 웹인 경우 null 반환', () => {
      const act = getAppInfo(uaMock.iosMWeb);
      expect(act).toBeNull();
    });

    it('PC인 경우 null 반환', () => {
      const act = getAppInfo(uaMock.pc);
      expect(act).toBeNull();
    });

    it('인스타 그램 웹뷰인 경우 null을 반환한다.', () => {
      const act = getAppInfo(uaMock.instagram);
      expect(act).toBeNull();
    });

    it('앱인 경우 앱 정보 반환', () => {
      const act = getAppInfo(uaMock.iosApp);
      expect(act).toEqual({
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
      });
    });
  });

  /** getOsVersion */
  describe('getOsVersion', () => {
    it('Agent의 버전표기가 2자리에서도 버전출력이 3자리 구조로 명확해야 한다.', () => {
      const act = getOsVersion(uaMock.iosApp);
      expect(act).toEqual({
        full: '15.0.0',
        major: 15,
        minor: 0,
        patch: 0,
      });
    });

    it('Android에서도 버전출력이 정상적으로 노출되어야 한다.', () => {
      const act = getOsVersion(uaMock.aosMWeb);
      expect(act).toEqual({
        full: '10.0.0',
        major: 10,
        minor: 0,
        patch: 0,
      });
    });

    it('PC라면 null을 반환한다.', () => {
      const act = getOsVersion(uaMock.pc);
      expect(act).toBeNull();
    });
  });

  /** getIsIOS */
  describe('getIsIOS', () => {
    it('iOS라면 true를 반환한다.', () => {
      const act = getIsIOS(uaMock.iosApp);
      expect(act).toBeTruthy();
    });

    it('iOS가 아니라면 false를 반환한다.', () => {
      const act = getIsIOS(uaMock.aosMWeb);
      expect(act).toBeFalsy();
    });

    it('PC라면 false를 반환한다.', () => {
      const act = getIsIOS(uaMock.aosMWeb);
      expect(act).toBeFalsy();
    });
  });

  /** getIsAndroid */
  describe('getIsAndroid', () => {
    it('Android라면 true를 반환한다.', () => {
      const act = getIsAndroid(uaMock.aosMWeb);
      expect(act).toBeTruthy();
    });

    it('Android가 아니라면 false를 반환한다.', () => {
      const act = getIsAndroid(uaMock.iosApp);
      expect(act).toBeFalsy();
    });

    it('PC라면 false를 반환한다.', () => {
      const act = getIsAndroid(uaMock.pc);
      expect(act).toBeFalsy();
    });
  });

  /** getBrowser */
  describe('getBrowser', () => {
    it('iOS 사파리 브라우저상에서는 모바일 사파리에 대한 값이 도출되어야 한다.', () => {
      const act = getBrowser(uaMock.iosMWeb);
      expect(act).toEqual('Mobile Safari');
    });

    it('Android에서 크롬 브라우저상에서는 크롬이 도출되어야 한다.', () => {
      const act = getBrowser(uaMock.aosMWeb);
      expect(act).toEqual('Chrome');
    });

    it('iOS에서 크롬 브라우저상에서는 크롬이 도출되어야 한다.', () => {
      const act = getBrowser(uaMock.iosMWebChrome);
      expect(act).toEqual('Chrome');
    });
  });
});

/** getEtcInAppBrowser */
describe('getEtcInAppBrowser', () => {
  it('인스타 그램 웹뷰에서는 instagram이 도출되어야 한다.', () => {
    const act = getEtcInAppBrowser(uaMock.instagram);
    expect(act).toEqual('instagram');
  });
  it('PRIZM APP에서는 빈값이 도출되어야 한다.', () => {
    const act = getEtcInAppBrowser(uaMock.iosApp);
    expect(act).toEqual('');
  });
});
