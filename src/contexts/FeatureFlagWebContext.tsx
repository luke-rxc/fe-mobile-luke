import { getFeatureFlagWebJSON } from '@apis/featureFlagWeb';
import { useQuery } from '@hooks/useQuery';
import { setFeatureFlagWeb } from '@utils/featureFlagWeb';
import { createContext, ReactNode } from 'react';

interface FeatureFlagWebProviderProps {
  children?: ReactNode;
}

export const FeatureFlagWebContext = createContext({});

/**
 * config 도메인의 feature-flag-web.json 호출 후 렌더링 하기 위함
 * 기존 FeatureFlags와는 별개의 기능
 * 관련 기능 고도화 되면서 해당 Context는 삭제될 수 있음
 */
export const FeatureFlagWebProvider = ({ children }: FeatureFlagWebProviderProps) => {
  const { isLoading } = useQuery(['config', 'feature-flag-web'], getFeatureFlagWebJSON, {
    onSuccess: (res) => setFeatureFlagWeb(res),
    onError: () => setFeatureFlagWeb({}),
    cacheTime: 0,
  });

  /**
   * 네트워크 응답후 렌더링 처리
   */
  if (isLoading) {
    return null;
  }

  return <FeatureFlagWebContext.Provider value={{}}>{children}</FeatureFlagWebContext.Provider>;
};
