import { FeatureFlagsType } from '@contexts/FeatureFlagsContext';
import { useFeatureFlags } from '@hooks/useFeatureFlags';
import styled from 'styled-components';

export const FeatureFlagProtoContainer = () => {
  const { getFeatureFlagsActiveStatus } = useFeatureFlags();
  const activeFeatureFlag = getFeatureFlagsActiveStatus(FeatureFlagsType.MWEB_DEV);
  return (
    <>
      <TitleStyled>Feature Flag Proto Page</TitleStyled>
      {activeFeatureFlag && <FeatureFlagStyled>MWEB_DEV feature flag is active</FeatureFlagStyled>}
    </>
  );
};

const TitleStyled = styled.div`
  font-size: ${({ theme }) => theme.fontSize.s20};
`;
const FeatureFlagStyled = styled.div`
  padding: 2rem;
  font-size: ${({ theme }) => theme.fontSize.s18};
  color: ${({ theme }) => theme.color.red};
`;
