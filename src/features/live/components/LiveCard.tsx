/* eslint-disable react-hooks/exhaustive-deps */
import { forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWebInterface } from '@hooks/useWebInterface';
import { LiveCard as Component, LiveCardProps as Props } from '@pui/liveCard';

export interface LiveCardProps extends Omit<Props, 'onChangeFollow'> {
  /** Follow 클릭 콜백 */
  onClickFollow?: Props['onChangeFollow'];
  /** Follow 변경 콜백 */
  onChangeFollow?: (liveId: number, follow: boolean) => void;
}

/**
 * useWebInterface의 subscribeSchedule이 연동된 LiveCard 컴포넌트
 */
export const LiveCard = styled(
  forwardRef<HTMLSpanElement, LiveCardProps>(
    ({ followed, liveId, onClickFollow: handleClickFollow, onChangeFollow, ...other }, ref) => {
      const { subscribeSchedule } = useWebInterface();
      const [follow, setFollow] = useState(followed ?? false);

      /**
       * props의 followed값이 변경될 때 내부 state 업데이트
       */
      useEffect(() => {
        setFollow((prev) => followed ?? prev);
      }, [followed]);

      /**
       * follow 상태에 대한 Sync
       *
       * webInterface의 subscribeSchedule state값이 업데이트될 때
       * 업데이트 된 라이브 알림신청 정보가 해당 컴포넌트가 가지고 있는 라이브 정보와 동일할때
       * 컴포넌트 내부의 follow 상태를 업데이트
       */
      useEffect(() => {
        if (!subscribeSchedule || !liveId) {
          return;
        }

        if (subscribeSchedule.type === 'live' && subscribeSchedule.id === liveId) {
          subscribeSchedule && setFollow(subscribeSchedule.isFollowed);

          // onlyState 옵션이 true인 경우 state 변경만 처리하고, 이후 onChangeFollow는 skip
          subscribeSchedule.options?.onlyState || onChangeFollow?.(subscribeSchedule.id, subscribeSchedule.isFollowed);
        }
      }, [subscribeSchedule]);

      return <Component ref={ref} {...other} followed={follow} liveId={liveId} onChangeFollow={handleClickFollow} />;
    },
  ),
)``;
