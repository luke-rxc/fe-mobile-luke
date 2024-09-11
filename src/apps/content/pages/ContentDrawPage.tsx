import { getFeatureFlagWeb } from '@utils/featureFlagWeb';
import ContentDrawGoodsPage from '../editorial/pages/ContentDrawGoodsPage';
import ContentDrawGoodsPageV2 from '../editorial2/pages/ContentDrawGoodsPage';

const ContentDrawPage = () => {
  const { contentV2 = true } = getFeatureFlagWeb();

  if (contentV2) {
    return <ContentDrawGoodsPageV2 />;
  }
  return <ContentDrawGoodsPage />;
};

export default ContentDrawPage;
