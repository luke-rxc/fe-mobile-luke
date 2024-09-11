import { forwardRef, useCallback, useMemo, useState } from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { useDialog } from '@hooks/useDialog';
import { Action } from '@pui/action';
import { Option } from '@pui/icon';
import { Profiles, ProfilesProps } from '@pui/profiles';
import type { ReplyModel } from '../../../models';
import { DropDown } from './DropDown';

type ReplyItemProps = HTMLAttributes<HTMLDivElement> & {
  /** 댓글 정보 */
  reply: ReplyModel;
  /** 신고 된 댓글인지 여부 */
  isReported: boolean;
  /** 댓글 삭제 */
  onDeleteReply: (reply: ReplyModel) => void;
  /** 댓글 수정 */
  onModifyReply: (reply: ReplyModel) => void;
  /** 댓글 신고 */
  onReportReply: (reply: ReplyModel) => void;
};

const ReplyItemComponent = forwardRef<HTMLDivElement, ReplyItemProps>(
  ({ className = '', reply, isReported = false, onDeleteReply, onModifyReply, onReportReply }, ref) => {
    const { openDialog } = useDialog();
    const { ago, contents, userNickName, isMine, userProfileImage } = reply;
    const profileProps: ProfilesProps = {
      showroomCode: '',
      liveId: null,
      size: 40,
      status: 'none',
      image: {
        src: userProfileImage.path,
        lazy: true,
      },
      disabledLink: true,
    };
    const [isShowOption, setIsShowOption] = useState<boolean>(false);

    const handleShowOption = useCallback(() => {
      setIsShowOption(true);
    }, []);

    /** TODO: 댓글 수정하기 */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleModifyReply = useCallback(() => {
      setIsShowOption(false);
      onModifyReply(reply);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reply]);

    /** 댓글 삭제 하기 */
    const handleDeleteReply = useCallback(() => {
      setIsShowOption(false);
      openDialog({
        title: '댓글을 삭제할까요?',
        type: 'confirm',
        cancel: {
          label: '취소',
        },
        confirm: {
          label: '확인',
          cb: () => {
            onDeleteReply(reply);
          },
        },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reply]);

    /** 댓글 신고하기 */
    const handleReportReply = useCallback(async () => {
      setIsShowOption(false);
      onReportReply(reply);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reply]);

    const menu = useMemo(() => {
      if (isMine) {
        return [
          /* {
            label: '수정',
            action: handleModifyReply,
          }, */
          {
            label: '삭제',
            action: handleDeleteReply,
          },
        ];
      }
      return [
        {
          label: <span className="report">신고</span>,
          action: handleReportReply,
        },
      ];
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reply]);

    return (
      <div
        className={classNames(className, {
          'is-reported': isReported,
        })}
        ref={ref}
      >
        <div className="message">
          <div className="user">
            <Profiles {...profileProps} />
            <p className="name">{userNickName}</p>
            <p className="created">{ago}</p>
          </div>
          <p className="comment">{contents}</p>
        </div>
        <Action is="button" className="btn-more" onClick={handleShowOption}>
          <Option />
        </Action>
        {isShowOption && (
          <div className="options">
            <DropDown menus={menu} onClose={() => setIsShowOption(false)} />
          </div>
        )}
      </div>
    );
  },
);

export const ReplyItem = styled(ReplyItemComponent)`
  position: relative;
  max-height: 20rem;
  /** 댓글 숨김 모션처리를 위한 높이값 */
  margin: 0 0.8rem 0 1.6rem;

  &.is-reported {
    overflow: hidden;
    max-height: 0px;
    opacity: 0;
    transition: opacity 0.125s ease-out, max-height 0.125s 0.125s ease-out;
  }

  .message {
    .user {
      display: flex;
      align-items: center;
    }

    .name {
      margin-right: 0.4rem;
      color: ${({ theme }) => theme.color.text.textPrimary};
      font: ${({ theme }) => theme.fontType.mini};
    }

    .created {
      color: ${({ theme }) => theme.color.text.textTertiary};
      font: ${({ theme }) => theme.fontType.mini};
    }

    .comment {
      padding: 0 0.8rem 0.8rem;
      color: ${({ theme }) => theme.color.text.textPrimary};
      font: ${({ theme }) => theme.fontType.medium};
    }
  }

  .btn-more {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    align-items: center;
    justify-content: center;
    width: 4.8rem;
    height: 4.8rem;

    &:active {
      opacity: 0.5;
    }

    & svg *[fill],
    svg *[stroke] {
      color: ${({ theme }) => theme.color.gray50};
    }
  }

  & > .options {
    position: absolute;
    top: 2.4rem;
    right: 0.8rem;
    width: 25rem;
    height: 1px;

    ${DropDown} {
      & .drop-menu {
        margin-top: 1.1rem;

        &.is-bottom {
          margin-top: 0;
          margin-bottom: -1.1rem;
        }
      }

      & .report {
        color: ${({ theme }) => theme.color.red};
      }
    }
  }
`;
