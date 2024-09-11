import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useInterval } from 'react-use';
import classNames from 'classnames';
import styled from 'styled-components';
import { Button } from '@pui/button';
import { useDDay } from '@services/useDDay';
// import { deleteVoteItem } from '../../../apis';
import { useIntersection } from '../../../hooks';
import type { ContentLogInfoModel, PresetComponentModel, PresetRefModel, VoteADisplayModel } from '../../../models';
import { useLogService, usePresetVoteAService } from '../../../services';
import { useContentStore } from '../../../stores';
import { handleGetDDayValue } from '../../../utils';
import { VoteItem } from './VoteItem';
import { VoteTimer } from './VoteTimer';

const VoteAComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents, voteList } = preset;

  if (!!visible && !voteList.length) {
    return <div ref={ref} />;
  }

  const displayValues = JSON.parse(contents) as VoteADisplayModel;
  const { color, button } = displayValues;
  const contentInfo = useContentStore.use.contentInfo();
  const contentLogInfo: ContentLogInfoModel = useMemo(() => {
    return {
      ...contentInfo,
      presetId,
      presetType,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { logPresetVoteInit } = useLogService();
  const { sectionRef, inView } = useIntersection({ once: true });
  const { id: voteId, title, startDate, endDate, nomineeList } = voteList[0];
  const { isEnd, remainDay } = useDDay({ time: endDate || 0 });

  const { voteItemList, voteButtonActive, handleVoteFinish, handleTapCertification, handleVoteUpdate } =
    usePresetVoteAService({
      voteId,
      list: nomineeList,
      contentLogInfo,
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
    if (inView) {
      logPresetVoteInit(contentLogInfo, { voteId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div ref={ref} {...props}>
      <VoteAContent
        ref={sectionRef}
        className={classNames('content-wrapper', {
          'is-coming': !isTimeComes,
        })}
        {...displayValues}
      >
        {!isTimePassedDate && <VoteTimer remainDay={remainDay} timer={timer} color={color} endDate={endDate} />}
        <p className="title">{title}</p>
        <div className="vote-list">
          {voteItemList.map((item) => {
            return (
              <VoteItem
                key={item.id}
                voteId={voteId}
                vote={item}
                color={color}
                button={button}
                active={isTimeComes && !isEnd && voteButtonActive}
                contentLogInfo={contentLogInfo}
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
        {/* <Button variant="primary" style={{ width: 200, margin: 25 }} onClick={() => deleteVoteItem(100)}>
          초기화(테스트 후 삭제 예정)
        </Button> */}
      </VoteAContent>
    </div>
  );
});
const VoteA = styled(VoteAComponent)``;
export default VoteA;

const VoteAContent = styled('div').attrs((props: VoteADisplayModel) => props)`
  padding-bottom: 4.8rem;
  background-color: ${({ backgroundInfo }) => backgroundInfo.color};

  & > .time-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2.4rem;

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
      color: ${({ color, theme }) => color || theme.color.text.textPrimary};
      font: ${({ theme }) => theme.content.contentStyle.fontType.smallB};
    }

    & .time-date {
      color: ${({ color, theme }) => color || theme.color.text.textPrimary};
      font: ${({ theme }) => theme.content.contentStyle.fontType.small};
    }
  }

  & > .title {
    padding: 4.8rem 2.4rem 1.6rem 2.4rem;
    color: ${({ color, theme }) => color || theme.color.text.textPrimary};
    font: ${({ theme }) => theme.content.contentStyle.fontType.titleB};
    text-align: center;
  }

  & > .vote-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    max-width: 40.8rem;
    margin: 0 auto;
    padding: 0 2.4rem;
    column-gap: 1.6rem;
    row-gap: 2.4rem;
  }

  & > .btn-box {
    padding: 2.4rem 2.4rem 0rem;

    & > ${Button} {
      width: 100%;
      background-color: ${({ button, theme }) => button.background || theme.color.brand.tint};
      color: ${({ button, theme }) => button.color || theme.color.white};
      font: ${({ theme }) => theme.content.contentStyle.fontType.mediumB};

      &:disabled {
        background-color: ${({ theme }) => theme.color.states.disabledBg};
        color: ${({ theme }) => theme.color.text.textDisabled};
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
`;
