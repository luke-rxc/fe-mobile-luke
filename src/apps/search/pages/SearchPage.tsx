import { useQueryString } from '@hooks/useQueryString';
import { SearchMainContainer, SearchResultContainer } from '../containers';
import type { SearchQueryParams } from '../types';

const SearchPage = () => {
  const { query } = useQueryString<SearchQueryParams>();

  return query ? <SearchResultContainer query={query} /> : <SearchMainContainer />;
};

export default SearchPage;
