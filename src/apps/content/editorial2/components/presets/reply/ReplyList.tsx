import { forwardRef, useState, useCallback, useEffect, useRef } from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import { PageError } from '@features/exception/components';
import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useDialog } from '@hooks/useDialog';
import { useModal } from '@hooks/useModal';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { Spinner } from '@pui/spinner';
import { ErrorModel } from '@utils/api/createAxios';
import nl2br from '@utils/nl2br';
import { ReplyPageType } from '../../../constants';
import type { ReplyDisplayModel, ReplyModel } from '../../../models';
import { useContentStoreService, usePresetReplyListService } from '../../../services';
import { useContentStore } from '../../../stores';
import { ReplyItem } from './ReplyItem';
import { ReplyReport } from './ReplyReport';

export type ReplyListProps = HTMLAttributes<HTMLDivElement> &
  ReplyDisplayModel & {
    /** 리스트 리셋 */
    onResetList: () => void;
  };

const ReplyListComponent = forwardRef<HTMLDivElement, ReplyListProps>(
  ({ className, useNotice, noticeTitle, noticeSubTitle, onResetList, ...props }, ref) => {
    const contentInfo = useContentStore.use.contentInfo();

    const { isIOSWebChrome } = useDeviceDetect();
    const { openDialog } = useDialog();
    const { isLogin } = useAuth();
    const { openModal } = useModal();
    const { handleSignIn } = useContentStoreService();
    const {
      // 댓글 리스트
      replyList = [],
      isListFetching,
      isListInitLoading,
      isListError,
      listError,
      hasNextPage,
      handleGetList,
      // 댓글 삭제
      handleDeleteReply: handleRequestDeleteReply,
      // 신고 사유
      reasonItem,
      handleCompleteReportReply,
    } = usePresetReplyListService({
      type: ReplyPageType.STORY,
      code: contentInfo.code,
    });
    const [isShowNotice] = useState<boolean>(useNotice && (!!noticeSubTitle.text || !!noticeTitle.text));
    const isHiddenReply = useRef<boolean>(false); // 리스트 숨김 처리 여부
    const [reportReplyId, setReportReplyId] = useState<number>(-1); // 신고된 댓글 id
    const [initEmptyState, setInitEmptyState] = useState<boolean>(true); // 초기 등록된 리스트가 empty 상태인지, 숨김에 의한 리스트 empty 상태인지 여부
    const [emptyTransition, setEmptyTransition] = useState<boolean>(false); // empty 트랜지션을 위한 값

    /** 댓글 삭제 */
    const handleDeleteReply = (reply: ReplyModel) => {
      handleRequestDeleteReply(reply.id, {
        onSuccess: () => onResetList(),
        onError: (error: ErrorModel) => {
          openDialog({
            title: error?.data?.message ?? '',
            confirm: {
              label: '확인',
            },
          });
        },
      });
    };

    /** TODO: 댓글 수정 */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleModifyReply = useCallback((reply: ReplyModel) => {
      // console.log(reply);
    }, []);

    /** 댓글 신고 */
    const handleReportReply = async (reply: ReplyModel) => {
      if (isLogin) {
        openModal({
          render: ({ onClose: handleCloseModal }) => (
            <ReplyReport
              replyType={ReplyPageType.STORY}
              code={contentInfo.code}
              replyId={reply.id}
              reasonItem={reasonItem}
              onCancel={handleCloseModal}
              onConfirm={({ isSuccess, message }: { isSuccess: boolean; message: string }) => {
                handleCloseModal();
                if (isSuccess) {
                  isHiddenReply.current = true;
                  setReportReplyId(reply.id);
                  setTimeout(() => {
                    // 사라짐 모션 이후 리스트에서 제거
                    setReportReplyId(-1);
                    handleCompleteReportReply(reply);
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

      const signInResult = await handleSignIn();
      if (signInResult) {
        onResetList();
      }
    };

    useEffect(() => {
      if (replyList.length === 0 && isHiddenReply.current) {
        setInitEmptyState(false);
        requestAnimationFrame(() => setEmptyTransition(true));
      }
    }, [replyList]);

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
            'is-list': replyList.length,
            'is-init-loading': isListInitLoading,
          })}
        >
          {isShowNotice && !listError && !isListFetching && (
            <div className="notice-wrapper">
              <>
                {noticeTitle && <p className="notice-title">{nl2br(noticeTitle.text)}</p>}
                {noticeSubTitle && <p className="notice-sub">{nl2br(noticeSubTitle.text)}</p>}
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
                    {!isEmpty(replyList) && (
                      <ul>
                        {replyList.map((reply: ReplyModel) => {
                          return (
                            <li key={`${reply.id}`}>
                              <ReplyItem
                                reply={reply}
                                isReported={reportReplyId === reply.id}
                                onDeleteReply={handleDeleteReply}
                                onModifyReply={handleModifyReply}
                                onReportReply={handleReportReply}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {isEmpty(replyList) && (
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
                            onAction: onResetList,
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
export const ReplyList = styled(ReplyListComponent)`
  height: 100%;
  word-break: break-all;

  ${InfiniteScroller} {
    display: flex;
    flex-direction: column;
    height: 100%;

    &.is-list {
      height: initial;
      padding-bottom: 2.4rem;
    }

    &.is-init-loading {
      height: 100%;

      & .infinite-loading {
        display: none;
      }
    }

    & .notice-wrapper {
      margin: 0 2.4rem 0.8rem;
      padding: 1.6rem;
      border-radius: ${({ theme }) => theme.radius.r8};
      background: ${({ theme }) => theme.color.background.bg};

      .notice-title {
        color: ${({ theme }) => theme.color.text.textPrimary};
        font: ${({ theme }) => theme.fontType.smallB};
      }

      .notice-sub {
        margin-top: 0.4rem;
        color: ${({ theme }) => theme.color.text.textTertiary};
        font: ${({ theme }) => theme.fontType.small};
      }
    }
  }

  & .state-wrapper {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;

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
