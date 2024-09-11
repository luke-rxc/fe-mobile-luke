import { useQueryString } from '@hooks/useQueryString';
import { CsNoticeListContainer } from '../containers';

const CsNoticeListPage = () => {
  const { sectionId } = useQueryString<{ sectionId?: string }>();

  return <CsNoticeListContainer sectionId={Number(sectionId)} />;
};

export default CsNoticeListPage;
