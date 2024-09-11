import { useParams } from 'react-router-dom';
import { CsFaqDetailContainer } from '../containers';

const CsFaqDetailPage = () => {
  const { articleId } = useParams<{ articleId: string }>();

  return <CsFaqDetailContainer articleId={Number(articleId)} />;
};

export default CsFaqDetailPage;
