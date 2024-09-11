import axios from 'axios';
import { useUnmount } from 'react-use';
import { useQueryClient } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { getNewNoticeCount } from '../apis/quickMenu';

/**
 * Query Key
 */
const NewNoticeCountKey = 'NEW_NOTICE_COUNT_QUERY_KEY';

/**
 * useNewNoticeCount
 */
export const useNewNoticeCount = (options: { enabled?: boolean }) => {
  const queryClient = useQueryClient();

  const { data, ...query } = useQuery(
    [NewNoticeCountKey],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ signal }: any) => {
      const cancelToken = axios.CancelToken;
      const source = cancelToken.source();

      const promise = getNewNoticeCount({ cancelToken: source.token });

      // https://tanstack.com/query/v4/docs/guides/query-cancellation#using-an-axios-version-less-than-v0220
      signal?.addEventListener('abort', () => {
        source.cancel('cancelled by useNewNoticeCount');
      });

      return promise;
    },
    { cacheTime: 0, ...options },
  );

  /**
   * api 요청을 중단하기 위한 핸들러
   */
  const cancel = () => {
    queryClient.cancelQueries([NewNoticeCountKey]);
  };

  /**
   * api요청 완료 전에 unmount될 경우 api요청취소
   */
  useUnmount(() => {
    query.isLoading && cancel();
  });

  return { count: data?.unreadCount, ...query, cancel };
};
