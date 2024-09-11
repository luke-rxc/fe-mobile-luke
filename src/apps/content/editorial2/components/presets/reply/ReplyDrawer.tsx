import { forwardRef, HTMLAttributes, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useDrawer } from '@hooks/useDrawer';
import { DrawerV2 as DrawerComp, DrawerDefault } from '@pui/drawer/v2';
import type { ContentLogInfoModel, PresetItemModel, ReplyDisplayModel } from '../../../models';
import { useContentStoreService, useLogService, usePresetReplyService } from '../../../services';
import { useContentStore } from '../../../stores';
import { ReplyInput } from './ReplyInput';
import { ReplyList } from './ReplyList';

export type ReplyDrawerProps = HTMLAttributes<HTMLDivElement> & {
  preset: PresetItemModel;
};

const ReplyDrawerComponent = forwardRef<HTMLDivElement, ReplyDrawerProps>(({ preset, className }, ref) => {
  const { presetId, presetType, contents } = preset;
  const displayValues = JSON.parse(contents) as ReplyDisplayModel;
  const { noticeTitle, noticeSubTitle, useNotice } = displayValues;
  const contentInfo = useContentStore.use.contentInfo();
  const contentLogInfo: ContentLogInfoModel = useMemo(() => {
    return {
      ...contentInfo,
      presetId,
      presetType,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { logPresetReplyInit } = useLogService();
  const { isIOS } = useDeviceDetect();
  const { open: isOpen, drawerOpen, drawerClose } = useDrawer();
  const { handleUpdateShowReply } = useContentStoreService();
  const { handleResetList } = usePresetReplyService({ code: contentInfo.code });
  const drawRef = useRef<HTMLDivElement>(null);
  const drawerDuration = DrawerDefault.transitionDuration;
  const [isTop, setIsTop] = useState(true);

  const handleClose = useCallback(() => {
    drawerClose();
    setTimeout(() => {
      // 트랜지션 닫힘이후 상태 업데이트
      handleUpdateShowReply(false);
    }, drawerDuration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeInputState = (status: boolean) => {
    if (isIOS) {
      return;
    }

    if (drawRef.current) {
      const drawerInnerEl = drawRef.current.querySelector('.drawer-inner') as HTMLDivElement;
      if (drawerInnerEl) {
        if (status) {
          drawerInnerEl.style.height = '100%';
        } else {
          drawerInnerEl.style.height = '';
        }
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScroll = ({ target }: any) => {
    setIsTop(target.scrollTop <= 0);
  };

  useEffect(() => {
    drawerOpen();
    logPresetReplyInit(contentLogInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={className}>
      <DrawerStyled dragging expandView to="-38%" snapTopPercent={85} open={isOpen} onClose={handleClose} ref={drawRef}>
        <div className="drawer-content">
          <div className="write">
            <ReplyInput
              handleResetList={handleResetList}
              onFocus={() => handleChangeInputState(true)}
              onBlur={() => handleChangeInputState(false)}
            />
          </div>
          <div
            className={classNames('scroll-wrapper', {
              scrolled: !isTop,
            })}
            onScroll={handleScroll}
          >
            <ReplyList
              useNotice={useNotice}
              noticeTitle={noticeTitle}
              noticeSubTitle={noticeSubTitle}
              onResetList={handleResetList}
            />
          </div>
        </div>
      </DrawerStyled>
    </div>
  );
});
export const ReplyDrawer = styled(ReplyDrawerComponent)``;

const DrawerStyled = styled(DrawerComp)`
  ${({ theme }) => theme.mixin.z('header', -1)};

  & .drag-handle-bar-wrapper {
    & .inner-bg {
      box-shadow: none !important;
    }
  }

  & .drawer-content {
    display: flex;
    flex-direction: column;
    height: 100%;

    & > .write {
      flex-shrink: 0;
      min-height: 4.8rem;
      margin-bottom: 1.6rem;
    }

    & > .scroll-wrapper {
      overflow-y: auto;
      flex-grow: 1;

      &.scrolled {
        mask-image: linear-gradient(
          180deg,
          transparent 0%,
          rgba(1, 1, 1, 1) 7.2rem,
          rgba(1, 1, 1, 1) calc(100% - 0.8rem),
          transparent 100%
        );
      }

      & > .scroll-inner {
        height: 100%;
      }
    }
  }
`;
