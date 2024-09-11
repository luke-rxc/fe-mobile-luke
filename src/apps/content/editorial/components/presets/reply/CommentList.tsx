import { forwardRef, useState, useContext, useCallback, useEffect, useRef } from 'react';
import type { HTMLAttributes } from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import classNames from 'classnames';
import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useDialog } from '@hooks/useDialog';
import { useModal } from '@hooks/useModal';
import { useWebInterface } from '@hooks/useWebInterface';
import { PageError } from '@features/exception/components';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { Spinner } from '@pui/spinner';
import { ErrorModel } from '@utils/api/createAxios';
import nl2br from '@utils/nl2br';
import { CommentContext } from '../../../context';
import type { CommentModel } from '../../../models';
import { usePresetCommentListService } from '../../../services';
import { CommentItem } from './CommentItem';
import { CommentReport } from './CommentReport';

export type CommentListProps = HTMLAttributes<HTMLDivElement> & {
  /** drawer open 상태 */
  open: boolean;
  /** 리스트 리셋 */
  handleResetList: () => void;
};

const CommentListComponent = forwardRef<HTMLDivElement, CommentListProps>(
  ({ className, handleResetList, open, ...props }, ref) => {
    const { commentType, code, useNotice, noticeTitle, noticeSubTitle } = useContext(CommentContext);
    const { isIOSWebChrome } = useDeviceDetect();
    const { signIn } = useWebInterface();
    const { openDialog } = useDialog();
    const { isLogin } = useAuth();
    const { openModal } = useModal();
    const {
      // 댓글 리스트
      commentList = [],
      isListFetching,
      isListInitLoading,
      isListError,
      listError,
      hasNextPage,
      handleGetList,
      // 댓글 삭제
      handleDeleteComment: handleRequestDeleteComment,
      // 신고 사유
      reasonItem,
      handleCompleteReportComment,
    } = usePresetCommentListService({
      type: commentType,
      code,
    });
    const [isShowNotice] = useState<boolean>(useNotice && (!!noticeSubTitle || !!noticeTitle));
    const isHiddenComment = useRef<boolean>(false); // 리스트 숨김 처리 여부
    const [reportCommentId, setReportCommentId] = useState<number>(-1); // 신고된 댓글 id
    const [initEmptyState, setInitEmptyState] = useState<boolean>(true); // 초기 등록된 리스트가 empty 상태인지, 숨김에 의한 리스트 empty 상태인지 여부
    const [emptyTransition, setEmptyTransition] = useState<boolean>(false); // empty 트랜지션을 위한 값

    /** 댓글 삭제 */
    const handleDeleteComment = useCallback(
      (comment: CommentModel) => {
        handleRequestDeleteComment(comment.id, {
          onSuccess: () => handleResetList(),
          onError: (error: ErrorModel) => {
            openDialog({
              title: error?.data?.message ?? '',
              confirm: {
                label: '확인',
              },
            });
          },
        });
      },
      [handleRequestDeleteComment, handleResetList, openDialog],
    );

    /** TODO: 댓글 수정 */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleModifyComment = useCallback((comment: CommentModel) => {
      // console.log(comment);
    }, []);

    /** 댓글 신고 */
    const handleReportComment = useCallback(
      async (comment) => {
        if (isLogin) {
          openModal({
            render: ({ onClose: handleCloseModal }) => (
              <CommentReport
                commentType={commentType}
                code={code}
                replyId={comment.id}
                reasonItem={reasonItem}
                onCancel={handleCloseModal}
                onConfirm={({ isSuccess, message }: { isSuccess: boolean; message: string }) => {
                  handleCloseModal();
                  if (isSuccess) {
                    isHiddenComment.current = true;
                    setReportCommentId(comment.id);
                    setTimeout(() => {
                      // 사라짐 모션 이후 리스트에서 제거
                      setReportCommentId(-1);
                      handleCompleteReportComment(comment);
                    }, 250); // 댓글 신고 숨기기 모션 타이밍에 맞추어 settimeout 설정
                  } else {
                    openDialog({
                      title: message,
                      confirm: {
                        label: '확인',
                      },
                    });
                  }
                }}
              />
            ),
            fadeTime: 0.2,
            timeout: 0.25,
            nonInnerBg: true,
          });

          return;
        }

        const signInResult = await signIn();
        if (signInResult) {
          handleResetList();
        }
      },
      [
        code,
        commentType,
        isLogin,
        openDialog,
        openModal,
        reasonItem,
        signIn,
        handleCompleteReportComment,
        handleResetList,
      ],
    );

    useEffect(() => {
      if (commentList.length === 0 && isHiddenComment.current) {
        setInitEmptyState(false);
        requestAnimationFrame(() => setEmptyTransition(true));
      }
    }, [commentList]);

    return (
      <div
        ref={ref}
        className={classNames(className, {
          'ios-chrome': isIOSWebChrome,
        })}
        {...props}
      >
        <InfiniteScroller
          disabled={!!hasNextPage === false || isListFetching}
          loading={isListFetching}
          onScrolled={handleGetList}
          className={classNames({
            'is-list': open && commentList.length,
            'is-init-loading': isListInitLoading,
          })}
        >
          {isShowNotice && !listError && !isListFetching && (
            <div className="notice-wrapper">
              <>
                {noticeTitle && <p className="notice-title">{nl2br(noticeTitle)}</p>}
                {noticeSubTitle && <p className="notice-sub">{nl2br(noticeSubTitle)}</p>}
              </>
            </div>
          )}
          <>
            {isListInitLoading && (
              <div className="state-wrapper">
                <div className="blank">
                  <Spinner size="small" />
                </div>
              </div>
            )}
            {!isListInitLoading && (
              <>
                {!isListError && (
                  <>
                    {!isEmpty(commentList) && (
                      <ul>
                        {commentList.map((comment: CommentModel) => (
                          <li key={`${comment.id}`}>
                            <CommentItem
                              comment={{ ...comment }}
                              isReported={reportCommentId === comment.id}
                              onDeleteComment={handleDeleteComment}
                              onModifyComment={handleModifyComment}
                              onReportComment={handleReportComment}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                    {isEmpty(commentList) && (
                      <div
                        className={classNames('state-wrapper', 'empty', {
                          'is-init-transition': !initEmptyState,
                          'is-transition': emptyTransition,
                        })}
                      >
                        <span className="empty-text">첫 번째 댓글을 남겨보세요</span>
                      </div>
                    )}
                  </>
                )}
                {isListError && listError && (
                  <div className="state-wrapper">
                    <div className="blank">
                      <PageError
                        isFull={false}
                        error={listError}
                        status={{
                          404: {
                            description: '페이지를 찾을 수 없습니다',
                          },
                          500: {
                            title: '일시적인 오류가 발생했습니다',
                            description: '잠시 후 다시 시도해주세요',
                            actionLabel: '다시 시도',
                            onAction: handleResetList,
                          },
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        </InfiniteScroller>
      </div>
    );
  },
);

/**
 * 댓글 리스트
 */
export const CommentList = styled(CommentListComponent)`
  height: 100%;
  word-break: break-all;

  ${InfiniteScroller} {
    height: 100%;
    display: flex;
    flex-direction: column;
    &.is-list {
      padding-bottom: 2.4rem;
      height: initial;
    }
    &.is-init-loading {
      height: 100%;
      & .infinite-loading {
        display: none;
      }
    }

    & .notice-wrapper {
      padding: 1.6rem;
      margin: 0 2.4rem 0.8rem;
      background: ${({ theme }) => theme.color.background.bg};
      border-radius: ${({ theme }) => theme.radius.r8};
      .notice-title {
        font: ${({ theme }) => theme.fontType.smallB};
        color: ${({ theme }) => theme.color.text.textPrimary};
      }
      .notice-sub {
        margin-top: 0.4rem;
        font: ${({ theme }) => theme.fontType.small};
        color: ${({ theme }) => theme.color.text.textTertiary};
      }
    }
  }

  & .state-wrapper {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    & .inner {
      padding-bottom: 7rem;
    }

    &.empty {
      align-items: start;
      margin-top: 5.35rem;
      color: ${({ theme }) => theme.color.text.textDisabled};
      font: ${({ theme }) => theme.fontType.small};

      &.is-init-transition {
        opacity: 0;
        transition: opacity 0.125s;
        &.is-transition {
          opacity: 1;
        }
      }

      & .empty-text {
        padding: 1.2rem 0;
      }
    }
  }

  .blank {
    padding-bottom: 1.6rem;
  }
`;
