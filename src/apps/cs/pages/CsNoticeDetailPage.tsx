import { useParams } from 'react-router-dom';
import { CsNoticeDetailContainer } from '../containers';

const CsNoticeDetailPage = () => {
  const { articleId } = useParams<{ articleId: string }>();

  return <CsNoticeDetailContainer articleId={Number(articleId)} />;
};

export default CsNoticeDetailPage;
