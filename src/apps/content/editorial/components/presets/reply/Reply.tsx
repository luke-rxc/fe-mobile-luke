import { useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import styled from 'styled-components';
import { useDrawer } from '@hooks/useDrawer';
import { CommentPageType } from '../../../constants';
import { CommentContext } from '../../../context';
import type { ReplyComponentRefModel, ReplyProps } from '../../../models';
import { useLogService } from '../../../services';
import { CommentDrawer } from './CommentDrawer';

const ReplyComponent = forwardRef<ReplyComponentRefModel, ReplyProps>((props, ref) => {
  const { className, noticeTitle, noticeSubTitle, useNotice, contentInfo } = props;
  const { logPresetReplyInit } = useLogService();
  const { open: isOpen, drawerOpen, drawerClose } = useDrawer();
  const containerRef = useRef<HTMLDivElement>(null);
  const [initView, setInitView] = useState<boolean>(true);

  const handleReplyModalOpen = useCallback(() => {
    drawerOpen();
    if (initView) {
      logPresetReplyInit(contentInfo);
      setInitView(false);
    }
  }, [drawerOpen, initView, logPresetReplyInit, contentInfo]);

  const handleReplyModalClose = useCallback(() => {
    drawerClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    ref: containerRef.current as HTMLDivElement,
    open: handleReplyModalOpen,
  }));

  return (
    <div ref={containerRef} className={className}>
      <CommentContext.Provider
        value={{
          commentType: CommentPageType.STORY,
          contentType: contentInfo.contentType,
          code: contentInfo.contentCode,
          useNotice,
          noticeTitle: noticeTitle.text ?? '',
          noticeSubTitle: noticeSubTitle.text ?? '',
        }}
      >
        <CommentDrawer open={isOpen} onDrawerClose={handleReplyModalClose} />
      </CommentContext.Provider>
    </div>
  );
});

/**
 * Mweb 용 댓글 컴포넌트
 */
export const Reply = styled(ReplyComponent)``;
