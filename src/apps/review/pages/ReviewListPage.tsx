import { useParams } from 'react-router-dom';
import { ReviewListType } from '@features/review/constants';
import { ReviewListContainer } from '../containers';

const ReviewListPage = () => {
  const { type, id, goodsId } = useParams<{ type: string; id: string; goodsId: string }>();
  const listType = type && type.toLowerCase() === 'showroom' ? ReviewListType.SHOWROOM : ReviewListType.GOODS;
  const listId = type ? +id : +goodsId;
  return <ReviewListContainer type={listType} id={+listId} />;
};

export default ReviewListPage;
