import { FeatureFlagsType } from '@contexts/FeatureFlagsContext';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useAuth } from '@hooks/useAuth';
import { useFeatureFlags } from '@hooks/useFeatureFlags';
import { Profile } from '../components';

export const ProfileContainer = () => {
  const { getFeatureFlagsActiveStatus } = useFeatureFlags();
  const activeFeatureFlag = getFeatureFlagsActiveStatus(FeatureFlagsType.MWEB_DEV);
  const { userInfo } = useAuth();

  useHeaderDispatch({
    type: 'mweb',
    enabled: activeFeatureFlag,
    quickMenus: ['cart', 'menu'],
  });

  if (!userInfo) {
    return <></>;
  }

  return <Profile user={userInfo} />;
};
