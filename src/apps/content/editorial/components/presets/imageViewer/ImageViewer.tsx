import { useState, forwardRef, useRef, useEffect, useImperativeHandle, useCallback } from 'react';
import styled from 'styled-components';
import { useIntersection } from '@hooks/useIntersection';
import { Action } from '@pui/action';
import { Conditional } from '@pui/conditional';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import type { ImageViewerComponentRefModel, ImageViewProps } from '../../../models';
import { useLogService } from '../../../services';
import { getLandingLink, getViewHeightForRatio } from '../../../utils';

const ImageViewerComponent = forwardRef<ImageViewerComponentRefModel, ImageViewProps>(
  ({ image, contentInfo, className, actions, useActions, visible }, ref) => {
    const [errorMedia, setErrorMedia] = useState<boolean>(false); // 미디어 에러상태
    const { logPresetImageViewerInit, logPresetImageViewerTab } = useLogService();
    const { inView, subscribe } = useIntersection(); // 뷰포트 교차
    const containerRef = useRef<HTMLDivElement>(null);
    const isFirstVisibleSection = useRef<boolean>(false);
    const link = useActions ? getLandingLink(actions) : '';

    const handleAction = useCallback(() => {
      if (!actions) {
        return;
      }
      logPresetImageViewerTab(contentInfo, actions);
    }, [actions, contentInfo, logPresetImageViewerTab]);

    const [viewHeight, setViewHeight] = useState(0);
    // 고정 비율시 높이 설정
    const handleSetViewHeight = useCallback(() => {
      const targetViewHeight = getViewHeightForRatio(image.width, image.height);
      setViewHeight(targetViewHeight);
    }, [image.height, image.width]);

    useImperativeHandle(ref, () => ({
      ref: containerRef.current as HTMLDivElement,
    }));

    // 뷰포트 교차
    useEffect(() => {
      if (containerRef.current) {
        subscribe(containerRef.current, { threshold: 0 });
      }
    }, [containerRef, subscribe]);

    useEffect(() => {
      if (!visible) return;
      if (inView && isFirstVisibleSection.current === false) {
        isFirstVisibleSection.current = true;
        logPresetImageViewerInit(contentInfo);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    useEffect(() => {
      handleSetViewHeight();
      window.addEventListener('resize', handleSetViewHeight);
      return () => {
        window.removeEventListener('resize', handleSetViewHeight);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div ref={containerRef} className={className}>
        {visible && (
          <Conditional
            condition={!!link}
            trueExp={<Action is="a" link={link} onClick={handleAction} />}
            falseExp={<></>}
          >
            {!errorMedia && (
              <Image
                {...(viewHeight && { height: `${viewHeight}px` })}
                src={getImageLink(image.path)}
                blurHash={image.blurHash}
                onError={() => setErrorMedia(true)}
                lazy
              />
            )}
            {errorMedia && <div className="overlay-error" />}
          </Conditional>
        )}
      </div>
    );
  },
);

/**
 * 이미지 컴포넌트
 */
export const ImageViewer = styled(ImageViewerComponent)`
  .overlay-error {
    width: 100%;
    height: 0;
    padding-top: ${({ image }) => `${(image.height / image.width) * 100}%`};
    background: ${({ theme }) => theme.color.gray8};
  }
  ${Action} {
    display: block;
    height: 100%;
  }

  ${Image} {
    vertical-align: top;
  }
`;
