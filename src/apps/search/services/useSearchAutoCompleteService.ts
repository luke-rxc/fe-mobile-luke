import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery } from '@hooks/useQuery';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { emitSearch } from '@utils/webInterface';
import { createDebug } from '@utils/debug';
import { getSearchAutoComplete } from '../apis';
import { SearchQueryKeys } from '../constants';
import { useChangeHistory } from '../hooks';
import { toSearchAutoCompleteModel } from '../models';

const debug = createDebug();

export const useSearchAutoCompleteService = (params: { query?: string } = {}) => {
  const { query = '' } = params;

  const { isApp } = useDeviceDetect();
  const history = useHistory();
  const { pathname: locationPath, search: locationQuery } = useLocation();
  const { searchValues, searchInfoUpdated } = useWebInterface();
  const { changeHistory } = useChangeHistory();

  const initializeContext = useRef(false);
  const [keyword, setKeyword] = useState('');

  const {
    data: searchAutoComplete,
    refetch: searchAutoCompleteRefetch,
    error: searchAutoCompleteError,
    isError: isSearchAutoCompleteError,
    isLoading: isSearchAutoCompleteLoading,
    isFetching: isSearchAutoCompleteFetching,
    isSuccess: isSearchAutoCompleteSuccess,
  } = useQuery(
    [SearchQueryKeys.ALL, SearchQueryKeys.SEARCH_AUTO_COMPLETE, keyword],
    () => getSearchAutoComplete({ query: keyword }),
    {
      enabled: !isApp && !!keyword,
      select: (data) => toSearchAutoCompleteModel({ ...data, keyword }),
      cacheTime: 0,
      keepPreviousData: !!keyword,
    },
  );

  const handleClickBack = () => {
    history.goBack();
  };

  const handleChangeSearchKeyword = (searchKeyword: string) => {
    debug.info('handleChangeSearchKeyword: %s', searchKeyword);

    setKeyword(searchKeyword.trim());
  };

  const handleSubmitSearchKeyword = (searchKeyword: string) => {
    debug.info('handleSubmitSearchKeyword: %s', searchKeyword);

    emitSearch({ query: searchKeyword });
  };

  /**
   * App -> Web or Web -> Web 검색 조건 변경
   */
  useEffect(() => {
    if (!initializeContext.current) {
      debug.log('initializeContext > searchValues: %O', searchValues);

      initializeContext.current = true;
      return;
    }

    debug.log('searchValues: %O', searchValues);

    changeHistory({ query: searchValues.query });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValues]);

  /**
   * Web -> App 검색 조건 동기화
   */
  useEffect(() => {
    // Location 변경시 스크롤 초기화
    window.scrollTo(0, 0);

    // Full Path
    const path = locationPath.concat(locationQuery);

    debug.log('searchInfoUpdated > query: %s, path: %s', query, path);

    searchInfoUpdated({ query, path });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationQuery]);

  return {
    searchAutoComplete,
    searchAutoCompleteRefetch,
    searchAutoCompleteError,
    isSearchAutoCompleteError,
    isSearchAutoCompleteLoading,
    isSearchAutoCompleteFetching,
    isSearchAutoCompleteSuccess,
    handleClickBack,
    handleChangeSearchKeyword,
    handleSubmitSearchKeyword,
  };
};
