import { useQueryString } from '@hooks/useQueryString';
import { CsFaqListContainer } from '../containers';

const CsFaqListPage = () => {
  const { sectionId } = useQueryString<{ sectionId?: string }>();

  return <CsFaqListContainer sectionId={Number(sectionId)} />;
};

export default CsFaqListPage;
