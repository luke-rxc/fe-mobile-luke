import { useContext } from 'react';
import {
  FeatureFlagsContext,
  FeatureFlagsFlagType,
  FeatureFlagsItem,
  FeatureFlagsType,
} from '@contexts/FeatureFlagsContext';
import { setLocalStorage } from '@utils/storage';
import { FEATURE_FLAG } from '@constants/featureFlag';

export const useFeatureFlags = () => {
  const { featureFlags, updateFeatureFlags } = useContext(FeatureFlagsContext);

  /**
   * feature flag 활성화 여부
   * @param type {FeatureFlagsType}
   */
  const getFeatureFlagsActiveStatus = (type: FeatureFlagsType) => {
    return featureFlags.find((item) => item.type === type)?.flag ?? false;
  };

  /**
   * feature flag 리스트
   */
  const getFeatureFlagList = () => {
    return featureFlags;
  };

  /**
   * feature flag list 설정
   * @param updateFlags {Array<FeatureFlagsItem>}
   */
  const setFeatureFlagList = (updateFlags: Array<FeatureFlagsItem>) => {
    const updateItems = updateFlags.filter((item) => item.flagType === FeatureFlagsFlagType.LOCAL_STORAGE);
    updateItems.length > 0 && setLocalStorage(FEATURE_FLAG, JSON.stringify(updateItems));
    updateFeatureFlags(updateFlags);
  };

  return {
    getFeatureFlagsActiveStatus,
    getFeatureFlagList,
    setFeatureFlagList,
  };
};
