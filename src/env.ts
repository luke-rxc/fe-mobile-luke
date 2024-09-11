/**
 * 앱 환경 변수 설정 모음
 */
export interface AppEnvironment {
  /**
   * 실제 서버(AWS)에 적용되는지의 여부
   */
  isProduction: boolean;
  /**
   * 스테이지 서버 여부
   */
  isStage: boolean;
  /**
   * 카나리 서버 여부
   */
  isCanary: boolean;
  /**
   * 개발 환경 여부 (로컬 구동 및 개발 서버 동일)
   */
  isDevelopment: boolean;
  /**
   * 로컬 구동 여부
   */
  isLocal: boolean;
  /**
   * 개발 환경 이름 (=== appEnv)
   */
  environmentName: string | undefined;
  /**
   * NODE_ENV
   */
  nodeEnv: {
    /**
     * NODE_ENV === production
     */
    isProduction: boolean;
  };
  endPoint: {
    /**
     * Application Origin
     * env.REACT_APP_BASE_URL 대응.
     */
    baseUrl: string;
    /**
     * Desktop Application Origin
     * env.REACT_APP_PC_BASE_URL 대응.
     */
    pcBaseUrl: string;
    /**
     * API 베이스 주소.
     * env.API_BASE_URL 대응.
     */
    apiBaseUrl: string;
    /**
     * CDN 주소
     * env.REACT_APP_CDN_URL 대응.
     */
    cdnUrl: string;
    /**
     * file server 기본 path
     * env.REACT_APP_CDN_URL 대응.
     */
    fileSvrUrl: string;
    /**
     * 라이브 웹소켓 기본 path
     * env.REACT_APP_LIVE_WEB_SOCKET_URL 대응.
     */
    liveWebSocketUrl: string;
    /**
     * 파일 업로드 API 베이스 주소.
     * env.UPLOAD_API_BASE_URL 대응.
     */
    uploadApiBaseUrl: string;
    /**
     * 웹 Config 베이스 주소.
     * env.CONFIG_BASE_URL 대응.
     */
    configBaseUrl: string;
  };
  /**
   * App(Webview) 관련 정보
   */
  app: {
    scheme: string;
    host: string;
    appLinkUrl: string;
    iosAppStoreUrl: string;
    aosAppStoreUrl: string;
  };
  /**
   * Developer 인증 Key
   */
  authKey: {
    /**
     * 카카오 Developer Key
     */
    kakao: string;
    kakaoRestApi: string;
    /**
     * 카카오 Pixel Track ID
     */
    kakaoPixel: string;
    /**
     * naver Developer Key
     */
    naver: string;
    /**
     * Apple Client ID
     */
    apple: string;
    /**
     * Facebook Pixel Key
     */
    facebookPixel: string;
    /**
     * Google Ads
     */
    googleAds: string;
    /**
     * hotJar
     */
    hotJar: {
      key: number;
      version: number;
    };
    /**
     * MixPanel
     */
    mixPanel: string;
    /**
     * Branch
     */
    branch: string;
  };
  /**
   * Sendbird application Id
   * TODO: 정확한 위치 지정되면 옮길 예정
   */
  sendbirdAppId: string;

  /**
   * Datadog RUM Application ID
   */
  datadogRumAppId: string;

  /**
   * Datadog RUM Client Token
   */
  datadogRumClientToken: string;

  /**
   * Datadog RUM Version (for Sourcemap)
   */
  datadogRumVersion: string;
}

const nodeEnv = process.env.NODE_ENV;

// REACT_APP_ENV 혹은 STORYBOOK_APP_ENV가 없는 경우 실수를 방지하기 위해 production으로 간주함.
const appEnv = process.env.REACT_APP_ENV || process.env.STORYBOOK_APP_ENV || 'production';

/**
 * @description CRA 내부에서 Build는 NODE_ENV를 Production으로 처리하기에 REACT_APP_ENV로 사용하였습니다.
 * @see {@link https://create-react-app.dev/docs/adding-custom-environment-variables/}
 */
const isNodeEnvProduction = nodeEnv === 'production';
const isLocal = nodeEnv !== 'production';
const isDevelopment = appEnv === 'development';
const isStage = appEnv === 'stage';
const isCanary = appEnv === 'canary';
const isProduction = appEnv === 'production';

const authKey = {
  kakao: '75f6f774eec2e0029f6e6bf261b91eb9',
  kakaoRestApi: 'ba83913e9974251d0b162854dd87f622',
  kakaoPixel: process.env.REACT_APP_KAKAO_PIXEL_TRACK_ID || '',
  naver: 'cozruFcatlb0Txs9pyXo',
  apple: 'kr.co.rxc.mweb.signin',
  /** @todo key 입력 필요 */
  facebookPixel: process.env.REACT_APP_FACEBOOK_PIXEL_TRACK_ID || '',
  googleAds: process.env.REACT_APP_GOOGLE_ADS_TRACK_ID || '',
  hotJar: {
    key: 2595766,
    version: 1,
  },
  mixPanel: process.env.REACT_APP_MIXPANEL_TOKEN || '',
  branch: process.env.REACT_APP_BRANCH_KEY || '',
};

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://api.prizm.co.kr';
const uploadApiBaseUrl = process.env.REACT_APP_UPLOAD_API_BASE_URL || 'https://upload.prizm.co.kr';
const baseUrl = process.env.REACT_APP_BASE_URL || 'https://mweb.prizm.co.kr';
const pcBaseUrl = process.env.REACT_APP_PC_BASE_URL || 'https://www.prizm.co.kr';
const cdnUrl = process.env.REACT_APP_CDN_URL || 'https://cdn-image.prizm.co.kr';
const liveWebSocketUrl = process.env.REACT_APP_LIVE_WEB_SOCKET_URL || 'wss://api.prizm.co.kr';
const fileSvrUrl = `${baseUrl}/static`;
const configBaseUrl = process.env.REACT_APP_CONFIG_BASE_URL || 'https://config.prizm.co.kr';
const sendbirdAppId = process.env.REACT_APP_SENDBIRD_APP_ID || '';
const datadogRumAppId = process.env.REACT_APP_DATADOG_RUM_APP_ID || '';
const datadogRumClientToken = process.env.REACT_APP_DATADOG_RUM_CLIENT_TOKEN || '';
const datadogRumVersion = process.env.REACT_APP_RELEASE_VERSION || '';

const app = {
  scheme: 'prizm',
  host: 'prizm.co.kr',
  appLinkUrl: 'prizm://prizm.co.kr',
  iosAppStoreUrl: 'https://apps.apple.com/kr/app/id1605514692',
  aosAppStoreUrl: 'https://play.google.com/store/apps/details?id=com.rxc.prizm',
};

export const env: AppEnvironment = {
  environmentName: appEnv,
  isLocal,
  isCanary,
  isDevelopment,
  isProduction,
  isStage,
  endPoint: {
    apiBaseUrl,
    baseUrl,
    pcBaseUrl,
    cdnUrl,
    fileSvrUrl,
    liveWebSocketUrl,
    uploadApiBaseUrl,
    configBaseUrl,
  },
  nodeEnv: {
    isProduction: isNodeEnvProduction,
  },
  app,
  authKey,
  sendbirdAppId,
  datadogRumAppId,
  datadogRumClientToken,
  datadogRumVersion,
};

export default env;
