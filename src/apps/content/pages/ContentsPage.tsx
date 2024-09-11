import { getFeatureFlagWeb } from '@utils/featureFlagWeb';
import { ContentContainer as V1Container } from '../editorial/containers/ContentContainer';
import { PageContainer as V2Container } from '../editorial2/containers/PageContainer';

const ContentsPage = () => {
  const { contentV2 = true } = getFeatureFlagWeb();

  if (contentV2) {
    return <V2Container />;
  }
  return <V1Container />;
};

export default ContentsPage;
