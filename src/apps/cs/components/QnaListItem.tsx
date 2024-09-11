import { forwardRef, HTMLAttributes } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { UniversalLinkTypes } from '@constants/link';
import { useLink } from '@hooks/useLink';
import { Action } from '@pui/action';
import { TicketStatusGroup, TicketStatusGroupLabel } from '../constants';

export type QnaListItemProps = Omit<HTMLAttributes<HTMLAnchorElement>, 'is' | 'href'> & {
  // 아이디
  requestId: number;
  // 제목
  title: string;
  // 상태
  status: TicketStatusGroup;
  // 상태 레이블
  statusLabel: TicketStatusGroupLabel;
  // 작성일시
  relativeTime: string;
};

const QnaListItemComponent = forwardRef<HTMLAnchorElement, QnaListItemProps>(
  ({ requestId, title, status, statusLabel, relativeTime, ...props }, ref) => {
    const { getLink } = useLink();

    // 공지사항 상세 링크
    const link = getLink(UniversalLinkTypes.CS_QNA_DETAIL, { requestId });

    return (
      <Action ref={ref} aria-label={title} is="a" link={link} {...props}>
        <div className="pressed-dimmed" />
        <div className="inner">
          <div className="title">{title}</div>
          <div className="title-meta">
            <span className={classnames('status', { 'is-waiting': status === TicketStatusGroup.WAITING })}>
              {statusLabel}
            </span>
            <span className="division" />
            <span className="time">{relativeTime}</span>
          </div>
        </div>
      </Action>
    );
  },
);

export const QnaListItem = styled(QnaListItemComponent)`
  display: flex;
  position: relative;

  .inner {
    flex-grow: 1;
    padding: 1.6rem 2.4rem;

    .title {
      display: -webkit-box;
      font: ${({ theme }) => theme.fontType.t15};
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .title-meta {
      padding-top: 0.4rem;
      display: flex;
      align-items: center;
      font: ${({ theme }) => theme.fontType.t12};
      line-height: 1.4rem;
      color: ${({ theme }) => theme.color.gray50};

      .status:not(.is-waiting) {
        color: ${({ theme }) => theme.color.black};
      }

      .division {
        padding: 0 0.8rem;
      }

      .division:after {
        display: block;
        background-color: ${({ theme }) => theme.color.gray8};
        content: '';
        height: 1rem;
        width: 0.1rem;
      }
    }
  }

  .pressed-dimmed {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.color.gray3};
    opacity: 0;
    transition: opacity 0.2s;
  }

  // pressed effect
  &:active {
    .pressed-dimmed {
      opacity: 1;
    }
  }
`;
