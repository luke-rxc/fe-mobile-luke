import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import isEmpty from 'lodash/isEmpty';
import { createDebug } from '@utils/debug';
import { SearchMainPath } from '../constants';

const debug = createDebug();

interface ChangeHistory {
  [key: string]: unknown;
  query?: string;
}

export const useChangeHistory = () => {
  const { pathname } = useLocation();
  const history = useHistory();

  const changeHistory = (params: ChangeHistory) => {
    const { query, ...rest } = params;

    // 검색 키워드가 없는 경우 대표 화면으로 전환
    if (isEmpty(query)) {
      history.replace(SearchMainPath);
      return;
    }

    debug.log('changeHistory parameters', query, rest);

    const queries = qs.stringify(params);

    debug.log('changeHistory queries', queries);

    history.replace([pathname, queries].join('?'));
  };

  return {
    changeHistory,
  };
};
