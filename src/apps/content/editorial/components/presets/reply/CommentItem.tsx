import { forwardRef, useCallback, useMemo, useState } from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { useDialog } from '@hooks/useDialog';
import { Profiles, ProfilesProps } from '@pui/profiles';
import { Option } from '@pui/icon';
import { Action } from '@pui/action';
import type { CommentModel } from '../../../models';
import { DropDown } from './DropDown';

type CommentItemProps = HTMLAttributes<HTMLDivElement> & {
  /** 코멘트 정보 */
  comment: CommentModel;
  /** 신고 된 댓글인지 여부 */
  isReported: boolean;
  /** 댓글 삭제 */
  onDeleteComment: (comment: CommentModel) => void;
  /** 댓글 수정 */
  onModifyComment: (comment: CommentModel) => void;
  /** 댓글 신고 */
  onReportComment: (comment: CommentModel) => void;
};

const CommentItemComponent = forwardRef<HTMLDivElement, CommentItemProps>(
  ({ className = '', comment, isReported = false, onDeleteComment, onModifyComment, onReportComment }, ref) => {
    const { openDialog } = useDialog();
    const { ago, contents, userNickName, isMine, userProfileImage } = comment;
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
    const handleModifyComment = useCallback(() => {
      setIsShowOption(false);
      onModifyComment(comment);
    }, [comment, onModifyComment]);

    /** 댓글 삭제 하기 */
    const handleDeleteComment = useCallback(() => {
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
            onDeleteComment(comment);
          },
        },
      });
    }, [comment, onDeleteComment, openDialog]);

    /** 댓글 신고하기 */
    const handleReportComment = useCallback(async () => {
      setIsShowOption(false);
      onReportComment(comment);
    }, [comment, onReportComment]);

    const menu = useMemo(() => {
      if (isMine) {
        return [
          /* {
            label: '수정',
            action: handleModifyComment,
          }, */
          {
            label: '삭제',
            action: handleDeleteComment,
          },
        ];
      }
      return [
        {
          label: <span className="report">신고</span>,
          action: handleReportComment,
        },
      ];
    }, [handleDeleteComment, handleReportComment, isMine]);

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

export const CommentItem = styled(CommentItemComponent)`
  position: relative;
  margin: 0 0.8rem 0 1.6rem;
  max-height: 20rem; // 댓글 숨김 모션처리를 위한 높이값
  &.is-reported {
    overflow: hidden;
    opacity: 0;
    max-height: 0px;
    transition: opacity 0.125s ease-out, max-height 0.125s 0.125s ease-out;
  }
  .message {
    .user {
      display: flex;
      align-items: center;
    }
    .name {
      font: ${({ theme }) => theme.fontType.mini};
      color: ${({ theme }) => theme.color.text.textPrimary};
      margin-right: 0.4rem;
    }
    .created {
      font: ${({ theme }) => theme.fontType.mini};
      color: ${({ theme }) => theme.color.text.textTertiary};
    }
    .comment {
      padding: 0 0.8rem 0.8rem;
      font: ${({ theme }) => theme.fontType.medium};
      color: ${({ theme }) => theme.color.text.textPrimary};
    }
  }
  .btn-more {
    position: absolute;
    top: 0;
    right: 0;
    width: 4.8rem;
    height: 4.8rem;
    display: flex;
    justify-content: center;
    align-items: center;

    &:active {
      opacity: 0.5;
    }

    & svg *[fill],
    svg *[stroke] {
      color: ${({ theme }) => theme.color.gray50};
    }
  }
  & > .options {
    width: 25rem;
    height: 1px;

    position: absolute;
    top: 2.4rem;
    right: 0.8rem;

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
