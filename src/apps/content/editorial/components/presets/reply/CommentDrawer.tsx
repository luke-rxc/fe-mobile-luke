import { forwardRef, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { DrawerV2 as DrawerComp } from '@pui/drawer/v2';
import { CommentContext } from '../../../context';
import { usePresetCommentService } from '../../../services';
import { CommentInput } from './CommentInput';
import { CommentList } from './CommentList';

export type CommentDrawerProps = HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  onDrawerClose: () => void;
};

const CommentDrawerComponent = forwardRef<HTMLDivElement, CommentDrawerProps>(
  ({ className, open, onDrawerClose, ...props }, ref) => {
    const { code } = useContext(CommentContext);
    const { isIOS } = useDeviceDetect();
    const { handleResetList } = usePresetCommentService({ code });
    const scrollEl = useRef<HTMLDivElement>(null);
    const drawRef = useRef<HTMLDivElement>(null);
    const [isTop, setIsTop] = useState(true);

    const handleClose = useCallback(() => {
      onDrawerClose?.();
      // drawer 닫힘 완료 후 스크롤 위치 리셋
      setTimeout(() => {
        if (scrollEl.current) {
          scrollEl.current.scrollTo(0, 0);
        }
      }, 500);
    }, [onDrawerClose]);

    const handleScroll = useCallback(({ target }) => {
      setIsTop(target.scrollTop <= 0);
    }, []);

    const handleChangeInputState = useCallback(
      (status: boolean) => {
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
      },
      [isIOS],
    );

    useEffect(() => {
      if (open) {
        handleResetList();
      }
    }, [handleResetList, open]);

    return (
      <div ref={ref} className={className} {...props}>
        <Drawer dragging expandView to="-38%" snapTopPercent={85} open={open} onClose={handleClose} ref={drawRef}>
          <div className="drawer-content">
            <div className="write">
              <CommentInput
                handleResetList={handleResetList}
                onFocus={() => handleChangeInputState(true)}
                onBlur={() => handleChangeInputState(false)}
              />
            </div>
            <div
              ref={scrollEl}
              className={classNames('scroll-wrapper', {
                scrolled: !isTop,
              })}
              onScroll={handleScroll}
            >
              <div className="scroll-inner">
                <CommentList open={open} handleResetList={handleResetList} />
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    );
  },
);

/**
 * 댓글 drawer 컴포넌트
 */
export const CommentDrawer = styled(CommentDrawerComponent)``;

/**
 * drawer style overriding
 */
const Drawer = styled(DrawerComp)`
  ${({ theme }) => theme.mixin.z('header', -1)};
  & .drag-handle-bar-wrapper {
    & .inner-bg {
      box-shadow: none !important;
    }
  }

  & .drawer-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    & > .write {
      min-height: 4.8rem;
      margin-bottom: 1.6rem;
      flex-shrink: 0;
    }
    & > .scroll-wrapper {
      flex-grow: 1;
      overflow-y: auto;

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
