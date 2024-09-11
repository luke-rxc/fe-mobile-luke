import { useModal } from '@hooks/useModal';
import { useMutation } from '@hooks/useMutation';
import { createDebug } from '@utils/debug';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getShowroomSimple } from '../apis';
import { closeFollowTime, delayFollowTime } from '../constants';
import { FollowInfoModel, ShowroomFollowModel, ShowroomSimpleModel, toShowroomSimpleModel } from '../models';
import { ReturnTypeUseLiveLogService } from '../services/useLogService';
import { getDiffMillisecondByToDate } from '../utils';
import { ReturnTypeUseDrawerStatus } from './useDrawerStatus';

const debug = createDebug('Live:folow');

const defaultFollowData: ShowroomFollowModel = {
  awaiter: null,
  runner: null,
};

interface Props {
  disabledFollow: boolean;
  showroomFollowDrawer: ReturnTypeUseDrawerStatus;
  logService: ReturnTypeUseLiveLogService;
}

export type ReturnTypeUseShowroomFollow = ReturnType<typeof useShowroomFollow>;

/**
 * 라이브 팔로우 요청 관련 hook
 */
export const useShowroomFollow = ({
  disabledFollow,
  showroomFollowDrawer,
  logService: { logLiveImpressionFollowRequest: handleLogLiveImpressionFollowRequest },
}: Props) => {
  // 라이브 팔로우 유도 시작 타이머 ref
  const timerStartRef = useRef<NodeJS.Timeout | null>(null);
  // 라이브 팔로우 유도 종료 타이머 ref
  const timerEndRef = useRef<NodeJS.Timeout | null>(null);
  // 라이브 팔로우 유도 data
  const [followData, setFollowData] = useState<ShowroomFollowModel>(defaultFollowData);
  // 쇼룸 리스트
  const [showroomList, setShowroomList] = useState<Array<ShowroomSimpleModel>>([]);
  const { latestDepth } = useModal();

  const { mutateAsync: requestShowroomFollowStatus } = useMutation((showroomId: number) =>
    getShowroomSimple(showroomId),
  );

  /**
   * 쇼룸 아이템 조회
   */
  const getShowroomItem = useCallback(
    async (id: number) => {
      const showroom = showroomList.find((item) => item.id === id);

      if (showroom !== undefined) {
        return Promise.resolve(showroom);
      }

      const showroomItem = await requestShowroomFollowStatus(id);
      debug.log('쇼룸 조회결과', showroomItem);
      return toShowroomSimpleModel(showroomItem);
    },
    [requestShowroomFollowStatus, showroomList],
  );

  /**
   * 라이브 팔로우 요청 정보 초기화
   */
  const handleClearFollowData = useCallback(() => {
    timerEndRef.current && clearTimeout(timerEndRef.current);
    showroomFollowDrawer.handleUpdateOpened(false);

    setTimeout(() => {
      setFollowData((prev) => {
        return {
          ...prev,
          runner: null,
        };
      });
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * timer 설정
   */
  const setTimer = useCallback(async () => {
    if (followData.awaiter !== null) {
      const { id, timedMetaDate } = followData.awaiter;
      const showroom = await getShowroomItem(id);

      // 쇼룸 팔로잉 되어 있을 경우 처리하지 않음
      if (showroom.isFollowed) {
        debug.warn(`쇼룸 팔로우 되어 있음`);
        setFollowData((prev) => {
          return {
            ...prev,
            awaiter: null,
          };
        });
        return;
      }

      // 시작된 타이머가 있을경우 초기화 처리
      if (timerStartRef.current !== null) {
        debug.warn(`+ start timer delete: ${timerStartRef.current}`);
        clearTimeout(timerStartRef.current);
        timerStartRef.current = null;
      }

      timerStartRef.current = setTimeout(() => {
        if (followData.runner !== null && followData.awaiter?.id !== followData.runner.id) {
          debug.warn(`- end timer stop: ${timerEndRef.current}`);
          if (timerEndRef.current) {
            clearTimeout(timerEndRef.current);
            timerEndRef.current = null;
          }
        }
        if (disabledFollow || latestDepth > 0) {
          debug.warn(`+ start timer stop(disabledFollow): ${timerStartRef.current}`, followData);
          setFollowData((prev) => {
            return {
              ...prev,
              awaiter: null,
            };
          });
          return;
        }

        debug.log(`+ start timer execute: ${timerStartRef.current}`);

        setFollowData((prev) => {
          return {
            awaiter: null,
            runner: prev.awaiter
              ? {
                  ...prev.awaiter,
                  showroom,
                }
              : null,
          };
        });
        showroomFollowDrawer.handleUpdateOpened(true);
        handleLogLiveImpressionFollowRequest(showroom);
        setShowroomList((prev) => {
          if (prev.includes(showroom)) {
            return prev;
          }
          return [...prev, showroom];
        });

        timerEndRef.current = setTimeout(() => {
          debug.log(`- end timer execute: ${timerEndRef.current}`);
          handleClearFollowData();
        }, closeFollowTime);
        debug.warn(`종료 타이머: ${closeFollowTime}ms 후 실행 / timerEndRef: ${timerEndRef.current}`);
      }, getDiffMillisecondByToDate(timedMetaDate, delayFollowTime));
      debug.warn(
        `스타트 타이머: ${getDiffMillisecondByToDate(
          timedMetaDate,
          delayFollowTime,
        )}ms 후 실행(${delayFollowTime})/ timerStartRef: ${timerStartRef.current}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabledFollow, followData, latestDepth, getShowroomItem, showroomFollowDrawer.opened]);

  useEffect(() => {
    setTimer();
  }, [followData.awaiter, setTimer]);

  useEffect(() => {
    return () => {
      debug.log('timer reset');
      timerStartRef.current = null;
      timerEndRef.current = null;
    };
  }, []);

  useEffect(() => {
    debug.log(followData, timerStartRef.current);
  }, [followData]);

  /**
   * 라이브 팔로우 요청 대기정보 업데이트
   */
  const handleUpdateFollowAwaiter = (followInfo: FollowInfoModel) => {
    debug.log('------------------------------------------------');
    debug.log(followInfo.id, followData);
    if (followData.awaiter?.id === followInfo.id || followData.runner?.id === followInfo.id) {
      debug.warn('같은 follow 요청');
      return;
    }
    setFollowData((prev) => {
      const { awaiter: prevAwaiter } = prev;

      return {
        ...prev,
        awaiter: {
          ...prevAwaiter,
          ...followInfo,
        },
      };
    });
  };

  /**
   * 라이브 팔로우 요청 종료 timer pending
   */
  const handlePendingFollowEndTimer = () => {
    timerEndRef.current && clearTimeout(timerEndRef.current);
    debug.log(`- end timer pending: ${timerStartRef.current}`);
  };

  /**
   * 라이브 팔로우 요청 종료 timer pending cancel
   */
  const handlePendingCancelFollowEndTimer = () => {
    timerEndRef.current = setTimeout(() => {
      debug.log(`- end timer execute(pending): ${timerStartRef.current}`);
      handleClearFollowData();
    }, closeFollowTime);
  };

  /**
   * 라이브 팔로우 요청 팔로우 status 업데이트
   */
  const handleUpdateFollowStatus = (showroomId: number) => {
    setFollowData((prev) => {
      return {
        ...prev,
        runner: prev.runner
          ? {
              ...prev.runner,
              showroom: prev.runner.showroom ? { ...prev.runner.showroom, isFollowed: true } : undefined,
            }
          : null,
      };
    });

    setTimeout(() => {
      handleClearFollowData();

      setShowroomList((prev) => {
        return prev.map((item) => {
          if (item.id === showroomId) {
            return {
              ...item,
              isFollowed: true,
            };
          }

          return item;
        });
      });
    }, 500);
  };

  return {
    followData,
    showroomList,
    handleClearFollowData,
    handleUpdateFollowAwaiter,
    handlePendingFollowEndTimer,
    handlePendingCancelFollowEndTimer,
    handleUpdateFollowStatus,
  };
};
