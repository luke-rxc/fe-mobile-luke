import { forwardRef, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { UniversalLinkTypes } from '@constants/link';
import { useLink } from '@hooks/useLink';
import { Action } from '@pui/action';

export type NoticeListItemProps = Omit<HTMLAttributes<HTMLAnchorElement>, 'is' | 'href'> & {
  // 아이디
  articleId: number;
  // 제목
  title: string;
  // 작성일시
  relativeTime: string;
  // 고정 게시글 여부
  pinned: boolean;
};

const NoticeListItemComponent = forwardRef<HTMLAnchorElement, NoticeListItemProps>(
  ({ articleId, title, relativeTime, pinned, ...props }, ref) => {
    const { getLink } = useLink();

    // 공지사항 상세 링크
    const link = getLink(UniversalLinkTypes.CS_NOTICE_DETAIL, { articleId });

    return (
      <Action ref={ref} aria-label={title} is="a" link={link} {...props}>
        <div className="pressed-dimmed" />
        <div className="badge">
          <span className={`dot ${pinned ? 'pinned' : ''}`} />
        </div>
        <div className="info">
          <div className={`title ${pinned ? 'pinned' : ''}`}>{title}</div>
          <div className="time">{relativeTime}</div>
        </div>
      </Action>
    );
  },
);

export const NoticeListItem = styled(NoticeListItemComponent)`
  display: flex;
  position: relative;

  .badge {
    position: absolute;
    top: 3.4rem;
    left: 0.8rem;

    .dot {
      display: none;
      background: ${({ theme }) => theme.color.tint};
      width: 0.8rem;
      min-width: 0.08rem;
      height: 0.8rem;
      border-radius: 100%;

      &.pinned {
        display: block;
      }
    }
  }

  .info {
    flex-grow: 1;
    padding: 1.6rem 2.4rem;

    .title {
      display: -webkit-box;
      font: ${({ theme }) => theme.fontType.t15};
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      &.pinned {
        font: ${({ theme }) => theme.fontType.t15B};
      }
    }

    .time {
      padding-top: 0.4rem;
      font: ${({ theme }) => theme.fontType.t12};
      color: ${({ theme }) => theme.color.gray50};
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
