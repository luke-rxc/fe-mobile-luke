import env from '@env';
import { datadogRum, RumInitConfiguration } from '@datadog/browser-rum';
import { createDebug } from '@utils/debug';
import isEmpty from 'lodash/isEmpty';
import isError from 'lodash/isError';

const debug = createDebug('datadog');

const datadogConfig: RumInitConfiguration = {
  applicationId: env.datadogRumAppId,
  clientToken: env.datadogRumClientToken,
  site: 'datadoghq.com',
  service: 'mobile-web-prizm',
  env: env.environmentName,
  version: env.datadogRumVersion,
  /**
   * 세션 샘플링 비율 설정
   * @description Production 레벨만 10% 비율로 설정하고, 나머지 환경은 수집량이 적으므로 100% 비율을 유지합니다.
   */
  sessionSampleRate: env.isProduction ? 10 : 100,
  // 세션 리플레이 disable 설정 값
  sessionReplaySampleRate: 0,
  trackResources: true,
  trackLongTasks: true,
  trackUserInteractions: true,
  defaultPrivacyLevel: 'mask-user-input',
};

export const init = () => {
  // 로컬 구동인 경우 Datadog 비활성화
  if (env.isLocal) {
    return;
  }

  debug.log('init', datadogConfig);

  // RUM Initialize
  datadogRum.init(datadogConfig);

  // RUM Session Recording
  // 비용 대비 활용도가 낮아 세션리플레이 기능 중지
  // datadogRum.startSessionReplayRecording();
  // 레코딩 수집이 지속되어 Stop 추가 호출 처리
  datadogRum.stopSessionReplayRecording();
};

type AddErrorParameters = Parameters<typeof datadogRum.addError>;

export function addError(...args: AddErrorParameters) {
  const [error, context] = args;
  // Custom error context
  const errorContext = { ...(isError(error) && { message: error.message }), ...context };
  // Datadog addError Parameters
  const parameters: AddErrorParameters = [error, { error: errorContext }];
  // remove context
  isEmpty(errorContext) && parameters.pop();
  datadogRum.addError(...parameters);
}

export const { setUser, clearUser, setGlobalContextProperty } = datadogRum;
