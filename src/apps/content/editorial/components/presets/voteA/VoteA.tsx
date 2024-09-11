import { forwardRef, useRef, useImperativeHandle, useMemo, useEffect, useState } from 'react';
import { useInterval } from 'react-use';
import styled from 'styled-components';
import classNames from 'classnames';
import { useIntersection } from '@hooks/useIntersection';
import { Button } from '@pui/button';
import { useDDay } from '@services/useDDay';
import type { VoteAProps, VoteAComponentRefModel } from '../../../models';
import { useLogService, usePresetVoteAService } from '../../../services';
import { handleGetDDayValue } from '../../../utils';
import { VoteItem } from './VoteItem';
import { VoteTimer } from './VoteTimer';

const VoteAComponent = forwardRef<VoteAComponentRefModel, VoteAProps>(
  ({ className, color, button, vote, contentInfo, visible }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      ref: containerRef.current as HTMLDivElement,
    }));

    if (!visible || !vote) {
      return <div ref={containerRef} className={className} />;
    }

    const { logPresetVoteInit } = useLogService();
    const sectionRef = useRef<HTMLDivElement>(null); // 전체 영역 el
    const isFirstVisibleSection = useRef<boolean>(false);
    const { inView, subscribe } = useIntersection(); // 뷰포트 교차
    const { id, startDate, endDate } = vote;
    const { isEnd, remainDay } = useDDay({ time: endDate || 0 });
    const { voteItemList, voteButtonActive, handleVoteFinish, handleTapCertification, handleVoteUpdate } =
      usePresetVoteAService({
        contentInfo,
        voteId: id,
        list: vote.voteList,
      });
    // 투표 시간 종료
    const isTimePassedDate = useMemo(() => {
      const now = Date.now();
      const nowDay = new Date(now).getDate();
      const endDay = new Date(endDate).getDate();
      return now > endDate && nowDay !== endDay; // 시간이 경과 되고, 날짜가 변경됐다고 판단되는 경우
    }, [endDate]);
    const isTimeComes = useMemo(() => Date.now() >= startDate, [startDate]); // 투표 시간 도래
    const intervalTime = useRef<number | null>(isEnd ? null : 1000);
    const [timer, setTimer] = useState(handleGetDDayValue(endDate, Date.now()));

    useInterval(() => {
      const now = Date.now();
      const distance = endDate - now;
      if (distance < 0) {
        // 종료 된 상태
        intervalTime.current = null;
      } else {
        setTimer(handleGetDDayValue(endDate, now));
      }
    }, intervalTime.current);

    useEffect(() => {
      if (sectionRef.current) {
        subscribe(sectionRef.current, { threshold: 0 });
      }
    }, [sectionRef, subscribe]);

    useEffect(() => {
      if (!visible) return;
      if (inView && isFirstVisibleSection.current === false) {
        isFirstVisibleSection.current = true;
        logPresetVoteInit(contentInfo, { voteId: id });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    return (
      <div ref={containerRef} className={className}>
        {visible && (
          <div
            className={classNames('vote', {
              'is-coming': !isTimeComes,
            })}
            ref={sectionRef}
          >
            {!isTimePassedDate && <VoteTimer remainDay={remainDay} timer={timer} color={color} endDate={endDate} />}
            <p className="title">{vote.title}</p>
            <div className="vote-list">
              {voteItemList.map((item) => {
                return (
                  <VoteItem
                    key={item.id}
                    voteId={vote.id}
                    vote={item}
                    color={color}
                    button={button}
                    active={isTimeComes && !isEnd && voteButtonActive}
                    contentInfo={contentInfo}
                    onVoteUpdate={handleVoteUpdate}
                    onVoteFinish={handleVoteFinish}
                  />
                );
              })}
            </div>
            {isTimeComes && !isTimePassedDate && (
              <div className="btn-box">
                <Button size="large" variant="primary" bold onClick={handleTapCertification}>
                  내 투표 인증서 보기
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

/**
 * 투표 컴포넌트
 */
export const VoteA = styled(VoteAComponent)`
  .vote {
    padding-bottom: 4.8rem;
    background-color: ${({ backgroundInfo }) => backgroundInfo.color};
    & > .time-box {
      padding: 2.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      & ${VoteTimer} {
        color: ${({ color, theme }) => color || theme.color.text.textPrimary};
        & .delimiter {
          color: ${({ color, theme }) => color || theme.color.text.textPlaceholder};
        }
      }
      & .time-text {
        margin-top: 0.8rem;
      }
      & .time-label {
        margin-right: 0.8rem;
        font: ${({ theme }) => theme.content.contentStyle.fontType.smallB};
        color: ${({ color, theme }) => color || theme.color.text.textPrimary};
      }
      & .time-date {
        font: ${({ theme }) => theme.content.contentStyle.fontType.small};
        color: ${({ color, theme }) => color || theme.color.text.textPrimary};
      }
    }
    & > .title {
      padding: 4.8rem 2.4rem 1.6rem 2.4rem;
      text-align: center;
      font: ${({ theme }) => theme.content.contentStyle.fontType.titleB};
      color: ${({ color, theme }) => color || theme.color.text.textPrimary};
    }

    & > .vote-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      row-gap: 2.4rem;
      column-gap: 1.6rem;
      max-width: 40.8rem;
      margin: 0 auto;
      padding: 0 2.4rem;
    }
    & > .btn-box {
      padding: 2.4rem 2.4rem 0rem;

      & > ${Button} {
        width: 100%;
        font: ${({ theme }) => theme.content.contentStyle.fontType.mediumB};
        color: ${({ button, theme }) => button.color || theme.color.white};
        background-color: ${({ button, theme }) => button.background || theme.color.brand.tint};
        &:disabled {
          color: ${({ theme }) => theme.color.text.textDisabled};
          background-color: ${({ theme }) => theme.color.states.disabledBg};
        }
      }
    }
    &.is-coming {
      ${VoteItem} {
        & .item-count {
          visibility: hidden;
        }
      }
    }
  }
`;
