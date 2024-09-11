import { useMutation } from '@hooks/useMutation';
import { createDebug } from '@utils/debug';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getLiveRaffleWinnerItem } from '../apis';
import { delayRaffleWinnerTime } from '../constants';
import { LiveRaffleWinnerModel, RaffleWinnerInfoModel } from '../models';
import { getDiffMillisecondByToDate } from '../utils';
import { ReturnTypeUseDrawerStatus } from './useDrawerStatus';

interface Props {
  liveId: number;
  raffleWinnerDrawer: ReturnTypeUseDrawerStatus;
}

const debug = createDebug('Live:raffle-winner');

export type ReturnTypeUseRaffleWinner = ReturnType<typeof useRaffleWinner>;

/**
 * 레플 당첨자 관련 hook
 */
export const useRaffleWinner = ({ liveId, raffleWinnerDrawer }: Props) => {
  // 라이브 레플 당첨자 발표 시작 타이머 ref
  const timerStartRef = useRef<NodeJS.Timeout | null>(null);
  // 라이브 레플 당첨자 발표 종료 타이머 ref
  const timerEndRef = useRef<NodeJS.Timeout | null>(null);
  // 라이브 레플 당첨자 발표 info
  const [raffleWinnerInfo, setRaffleWinnerInfo] = useState<RaffleWinnerInfoModel | null>(null);
  // 라이브 레플 당첨자 item
  const [liveRaffleWinnerItem, setLiveRaffleWinnerItem] = useState<LiveRaffleWinnerModel | null>(null);

  const { mutateAsync: requestLiveRaffleWinnerItem } = useMutation((raffleItemId: number) =>
    getLiveRaffleWinnerItem(liveId, raffleItemId),
  );

  /**
   * timer 설정
   */
  const setTimer = useCallback(async () => {
    if (raffleWinnerInfo !== null && liveRaffleWinnerItem === null) {
      const { id, timedMetaDate } = raffleWinnerInfo;
      const raffleWinnerItem = await requestLiveRaffleWinnerItem(id);
      debug.log('raffleWinnerItem', raffleWinnerItem);
      // 시작된 타이머가 있을경우 초기화 처리
      if (timerStartRef.current !== null) {
        debug.warn(`+ start timer delete: ${timerStartRef.current}`);
        clearTimeout(timerStartRef.current);
        timerStartRef.current = null;
      }

      // const closeTime = raffleWinnerItem.winnerList.length * 1500;

      timerStartRef.current = setTimeout(() => {
        debug.log(`+ start timer execute: ${timerStartRef.current}`);

        if ((raffleWinnerItem.winnerList || []).length > 0) {
          setLiveRaffleWinnerItem(raffleWinnerItem);
          raffleWinnerDrawer.handleUpdateOpened(true);
        } else {
          debug.error('당첨자 리스트가 비어있음', raffleWinnerItem);
        }

        // timerEndRef.current = setTimeout(() => {
        //   debug.log(`- end timer execute: ${timerEndRef.current}`);
        //   handleClearRaffleWinner();
        // }, closeTime);
        // debug.warn(`종료 타이머: ${closeTime}ms 후 실행 / timerEndRef: ${timerEndRef.current}`);
      }, getDiffMillisecondByToDate(timedMetaDate, delayRaffleWinnerTime));
      debug.warn(
        `스타트 타이머: ${getDiffMillisecondByToDate(
          timedMetaDate,
          delayRaffleWinnerTime,
        )}ms 후 실행(${delayRaffleWinnerTime})/ timerStartRef: ${timerStartRef.current}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raffleWinnerInfo]);

  useEffect(() => {
    setTimer();
  }, [raffleWinnerInfo, setTimer]);

  useEffect(() => {
    return () => {
      debug.log('timer reset');
      timerStartRef.current = null;
      timerEndRef.current = null;
    };
  }, []);

  /**
   * 라이브 레플 당첨자 info update
   */
  const handleUpdateRaffleWinnerInfo = (item: RaffleWinnerInfoModel) => {
    setRaffleWinnerInfo(item);
  };

  /**
   * 라이브 레플 당첨자 정보 초기화
   */
  const handleClearRaffleWinner = useCallback(() => {
    timerEndRef.current && clearTimeout(timerEndRef.current);
    raffleWinnerDrawer.handleUpdateOpened(false);

    setTimeout(() => {
      setLiveRaffleWinnerItem(null);
      setRaffleWinnerInfo(null);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 라이브 레플 당첨자 종료 timer pending
   */
  const handlePendingRaffleWinnerEnd = () => {
    timerEndRef.current && clearTimeout(timerEndRef.current);
    debug.log(`- end timer pending: ${timerStartRef.current}`);
  };

  return {
    // 당첨자 발표 drawer open 여부
    openedDrawer: raffleWinnerDrawer.opened,
    // 라이브 레플 당첨자 item
    liveRaffleWinnerItem,
    handleUpdateRaffleWinnerInfo,
    // 라이브 레플 당첨자 정보 초기화
    handleClearRaffleWinner,
    handlePendingRaffleWinnerEnd,
  };
};
