import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { tracking, supported, facebook, kakaoPixel, googleAds, datadogRum, branch } from '@utils/log';
import { getFeatureFlagWeb } from '@utils/featureFlagWeb';

const AppHead = () => {
  const { pathname, search } = useLocation();
  const { isApp, ...restAgentInfo } = useDeviceDetect();

  /**
   * Path 별로 체크하여 init
   */
  useEffect(() => {
    // HotJar
    if (supported.hotJar(pathname)) {
      tracking.initHotJar();
    }

    // mixPanel
    /** @todo 현재 페이지별로 호출하게 되어있지만, 세션당 호출로 변경 타진 */
    if (supported.mixPanel({ pathname, search })) {
      tracking.initMixPanel();
    }
  }, [pathname, search]);

  /**
   * 한 세션당 한번의 호출로만 진행
   */
  useEffect(() => {
    // Facebook Pixel
    !isApp && facebook.init();

    // Kakao Pixel
    !isApp && kakaoPixel.init();

    // Google Ads
    !isApp && googleAds.init();

    // Datadog RUM
    datadogRum.init();

    const { version: featureFlagVersion } = getFeatureFlagWeb();
    // Datadog RUM Custom Context
    datadogRum.setGlobalContextProperty('agentInfo', { isApp, ...restAgentInfo, featureFlagVersion });

    // branch
    !isApp && branch.init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: 메타 처리를 제거하면서 반환될 부분이 없으므로 Hook으로 변경이 필요하나 hotJar/MixPanel 등 영향범위 체크가 필요하여 null로 임시 처리하고 현행 유지함.
  return null;
};

export default AppHead;
