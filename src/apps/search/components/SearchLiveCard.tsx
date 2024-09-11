import { createElement, forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useModal } from '@hooks/useModal';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { LiveCard, LiveCardProps } from '@pui/liveCard';
import { TeaserModalContainer as teaserModal } from '@features/schedule/containers';

export interface SearchLiveCardProps extends Omit<LiveCardProps, 'onChangeFollow'> {
  // Follow 클릭 콜백
  onClickFollow?: ({ liveId, scheduleId }: { liveId: number; scheduleId: number }, follow: boolean) => void;
  // Follow 변경 콜백
  onChangeFollow?: (liveId: number, follow: boolean) => void;
}

export const SearchLiveCard = styled(
  forwardRef<HTMLSpanElement, SearchLiveCardProps>((props, ref) => {
    const { openModal } = useModal();
    const { subscribeSchedule } = useWebInterface();
    const { isApp } = useDeviceDetect();

    const { followed, liveId, onClickFollow, onChangeFollow, ...other } = props;

    const [follow, setFollow] = useState(followed ?? false);

    // 모웹 티저 팝업인 경우 처리
    const handleClickTeaser: SearchLiveCardProps['onClickLink'] = (e, item) => {
      const { onAir, scheduleId, landingType } = item;

      if (!isApp && !onAir && scheduleId && landingType === 'SCHEDULE_TEASER') {
        e.preventDefault();
        openModal({
          nonModalWrapper: true,
          render: (renderProps) => createElement(teaserModal, { scheduleId: +scheduleId, ...renderProps }),
        });
      }
    };

    useEffect(() => {
      setFollow((prev) => followed ?? prev);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [followed]);

    /**
     * 알림 신청 여부 변경사항 구독
     */
    useEffect(() => {
      if (!subscribeSchedule || !liveId) {
        return;
      }

      if (subscribeSchedule.type === 'live' && subscribeSchedule.id === liveId) {
        setFollow(subscribeSchedule.isFollowed);

        // onlyState 옵션이 true인 경우 state 변경만 처리하고, 이후 onChangeFollow는 skip
        subscribeSchedule.options?.onlyState || onChangeFollow?.(subscribeSchedule.id, subscribeSchedule.isFollowed);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscribeSchedule]);

    return (
      <LiveCard
        ref={ref}
        {...other}
        followed={follow}
        liveId={liveId}
        onChangeFollow={(isFollowed, { liveId: id, scheduleId }) => {
          id && scheduleId && onClickFollow?.({ liveId: Number(id), scheduleId: Number(scheduleId) }, isFollowed);
        }}
        onClickLink={handleClickTeaser}
      />
    );
  }),
)``;
