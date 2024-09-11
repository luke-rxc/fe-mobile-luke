import { useQueryString } from '@hooks/useQueryString';
import { SearchGoodsListContainer } from '../containers';
import type { GoodsSearchQueryParams } from '../types';

const SearchGoodsListPage = () => {
  const params = useQueryString<GoodsSearchQueryParams>();

  return <SearchGoodsListContainer {...params} />;
};

export default SearchGoodsListPage;
