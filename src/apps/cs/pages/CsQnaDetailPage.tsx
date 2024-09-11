import { useParams } from 'react-router-dom';
import { CsQnaDetailContainer } from '../containers';

const CsQnaDetailPage = () => {
  const { requestId } = useParams<{ requestId: string }>();

  return <CsQnaDetailContainer requestId={Number(requestId)} />;
};

export default CsQnaDetailPage;
