import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { useCallback, useEffect, useState } from 'react';
import { InfiniteData, useMutation, useQueryClient } from 'react-query';
import { createDebug } from '@utils/debug';
import { useAuth } from '@hooks/useAuth';
import { useWebInterface } from '@hooks/useWebInterface';
import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { getShowroomList, postShowroomSubscribe } from '../apis';
import { ShowroomItemInfoModel, ShowroomItemModel, toShowroomListModel, toSubscribeStatusListParams } from '../models';
import { dismissConfirmText, showroomQueryKey } from '../constants';
import { useLogService } from './useLogService';
import { ShowroomItemSchema } from '../schemas';

const debug = createDebug('features:member:useMemberFollowService');

export const useMemberFollowService = () => {
  // 전체 쇼룸 목록
  const [showroomList, setShowroomList] = useState<ShowroomItemInfoModel[]>([]);
  // 사용자가 체크한 쇼룸 목록
  const [checkedShowroomList, setCheckedShowroomList] = useState<ShowroomItemInfoModel[]>([]);
  // 전체 선택 버튼(native) 클릭 여부
  const [tappedToolbarButton, setTappedToolbarButton] = useState<boolean>(false);
  // dismiss confirmable 체크 여부
  const [isConfirmable, setIsConfirmable] = useState<boolean>(false);

  const { getIsLogin } = useAuth();
  const {
    generateHapticFeedback,
    showroomFollowStatusUpdated,
    setDismissConfirm,
    toolbarButtonTappedValue,
    signIn,
    close,
  } = useWebInterface();

  const { logTabShowroom, logTabSelectAll, logImpressionShowroom, logCompleteShowroomFollow, logViewOnboardingPage } =
    useLogService();
  const queryClient = useQueryClient();

  const {
    data,
    error: showroomError,
    isError: isShowroomError,
    isLoading: isShowroomLoading,
    isFetching: isShowroomFetching,
    hasNextPage: hasMoreShowroom,
    fetchNextPage: handleLoadShowroom,
  } = useInfiniteQuery(showroomQueryKey, ({ pageParam: nextParameter }) => getShowroomList({ nextParameter }), {
    select: ({ pages, pageParams }) => {
      return { pages: pages.flatMap(toShowroomListModel), pageParams };
    },
    getNextPageParam: ({ nextParameter }) => nextParameter,
    refetchOnMount: true,
    onSuccess: (result: InfiniteData<ShowroomItemModel>) => {
      const queryData =
        queryClient.getQueryData<InfiniteData<LoadMoreResponseSchema<ShowroomItemSchema>>>(showroomQueryKey);
      const lastGoodsIndex = queryData?.pages.slice(0, -1).flatMap(({ content }) => content).length || 0;
      const contentLength = queryData?.pages.slice(-1)[0].content.length;

      return logImpressionShowroom(lastGoodsIndex, Number(contentLength), result.pages.slice(lastGoodsIndex));
    },
  });

  /**
   * 쇼룸 목록 세팅
   */
  useEffect(() => {
    if (data) {
      setShowroomList(
        data.pages.map(({ id, name, code }) => ({
          id,
          name,
          code,
        })),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  /**
   * 쇼룸 아이템 클릭 이벤트
   */
  const handleClickShowroom = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, id: number, index: number) => {
      const { checked, title, value } = e.target;
      if (checked) {
        setCheckedShowroomList([...checkedShowroomList, { id, name: title, code: value }]);
        generateHapticFeedback({ type: GenerateHapticFeedbackType.TapLight });
      } else {
        setCheckedShowroomList(checkedShowroomList.filter((showroomId) => showroomId.id !== id));
      }
      logTabShowroom({ id, name: title, 'data-index': index + 1 });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkedShowroomList],
  );

  useEffect(() => {
    setIsConfirmable(checkedShowroomList.length > 0);
  }, [checkedShowroomList.length, handleClickShowroom]);

  /**
   * dismiss confirm 인터페이스 호출
   */
  useEffect(() => {
    // 선택된 쇼룸이 1개 이상일 경우 isConfirmable: true
    setDismissConfirm({ ...dismissConfirmText, isConfirmable });
  }, [isConfirmable, setDismissConfirm]);

  /**
   * 쇼룸 팔로우
   */
  const { mutateAsync: showroomSubscribe } = useMutation(
    (showRoomIdList: number[]) => postShowroomSubscribe({ showRoomIdList }),
    {
      onSuccess: (res) => {
        debug.log('follow success', res);

        // 쇼룸 팔로잉 완료 시, 인터페이스 호출
        showroomFollowStatusUpdated({
          showroomList: toSubscribeStatusListParams(checkedShowroomList),
        });

        logCompleteShowroomFollow(checkedShowroomList);

        close();
      },
      onError: (err) => {
        debug.log('follow error', err);
      },
    },
  );

  /**
   * 완료 CTA 버튼 클릭 시
   */
  const handleClickComplete = async () => {
    generateHapticFeedback({ type: GenerateHapticFeedbackType.TapMedium });

    if (!getIsLogin()) {
      const signInResult = await signIn();
      if (signInResult) {
        showroomSubscribe(checkedShowroomList.map((showroom) => showroom.id));
      }
      return;
    }
    showroomSubscribe(checkedShowroomList.map((showroom) => showroom.id));
  };

  /**
   * 전체 선택(native) 체크 연동
   */
  useEffect(() => {
    if (toolbarButtonTappedValue && toolbarButtonTappedValue.type === 'selectAll') {
      setTappedToolbarButton(!tappedToolbarButton);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolbarButtonTappedValue]);

  useEffect(() => {
    logViewOnboardingPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data && data.pages.length > 0) {
      if (checkedShowroomList.length >= 0 && checkedShowroomList.length < showroomList.length) {
        // 쇼룸 전체 선택
        setCheckedShowroomList(showroomList);
        logTabSelectAll('select_all');
        generateHapticFeedback({ type: GenerateHapticFeedbackType.TapLight });
      } else {
        // 쇼룸 전체 선택 해제
        setCheckedShowroomList([]);
        logTabSelectAll('unselect_all');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tappedToolbarButton]);

  return {
    showroomList: data?.pages || [],
    checkedShowroomList,
    showroomError,
    isShowroomError,
    isShowroomLoading,
    isShowroomFetching,
    hasMoreShowroom,
    tappedToolbarButton,
    handleLoadShowroom,
    handleClickShowroom,
    handleClickComplete,
  };
};
