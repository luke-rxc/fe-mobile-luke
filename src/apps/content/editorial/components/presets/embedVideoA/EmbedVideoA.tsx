import { useState, forwardRef, useRef, useEffect, useImperativeHandle, useCallback } from 'react';
import styled from 'styled-components';
import { AppLinkTypes } from '@constants/link';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useIntersection } from '@hooks/useIntersection';
import { Action } from '@pui/action';
import { Image } from '@pui/image';
import { VideoPlay } from '@pui/lottie';
import { theme as styleTheme } from '@styles/theme';
import { getAppLink } from '@utils/link';
import type { EmbedVideoAComponentRefModel, EmbedVideoAProps } from '../../../models';
import { useLogService } from '../../../services';
import { getViewHeightForRatio } from '../../../utils';

const EmbedVideoAComponent = forwardRef<EmbedVideoAComponentRefModel, EmbedVideoAProps>(
  ({ embedId, link, contentInfo, className, visible }, ref) => {
    const { isApp } = useDeviceDetect();
    const [errorMedia, setErrorMedia] = useState<boolean>(false); // 미디어 에러상태
    const { logPresetEmbedVideoInit, logPresetEmbedVideoTab } = useLogService();
    const { inView, subscribe } = useIntersection(); // 뷰포트 교차
    const containerRef = useRef<HTMLDivElement>(null);
    const isFirstVisibleSection = useRef<boolean>(false);
    const videoUrl = isApp ? getAppLink(AppLinkTypes.EXTERNAL_WEB, { url: link }) : link;

    useImperativeHandle(ref, () => ({
      ref: containerRef.current as HTMLDivElement,
    }));

    const handleAction = useCallback(() => {
      if (!link) {
        return;
      }
      logPresetEmbedVideoTab(contentInfo);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [viewHeight, setViewHeight] = useState(0);
    // 고정 비율시 높이 설정
    const handleSetViewHeight = useCallback(() => {
      const targetViewHeight = getViewHeightForRatio(16, 9);
      setViewHeight(targetViewHeight);
    }, []);

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
        logPresetEmbedVideoInit(contentInfo);
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
          <Action is="a" link={videoUrl} target="_blank" onClick={handleAction}>
            {!errorMedia && (
              <>
                <Image
                  {...(viewHeight && { height: `${viewHeight}px` })}
                  src={`https://img.youtube.com/vi/${embedId}/sddefault.jpg`}
                  onError={() => setErrorMedia(true)}
                  lazy
                />
                <span className="btn-container">
                  <span className="ico-btn">
                    <VideoPlay
                      animationOptions={{ autoplay: false, loop: false }}
                      lottieColor={styleTheme.color.whiteLight}
                    />
                  </span>
                </span>
              </>
            )}
            {errorMedia && <div className="overlay-error" />}
          </Action>
        )}
      </div>
    );
  },
);

/**
 * 임베드 컴포넌트
 */
export const EmbedVideoA = styled(EmbedVideoAComponent)`
  position: relative;
  .overlay-error {
    width: 100%;
    height: 0;
    padding-top: ${() => `${(16 / 9) * 100}%`};
    background: ${({ theme }) => theme.color.gray8};
  }
  ${Action} {
    display: block;
    height: 100%;
  }

  ${Image} {
    vertical-align: top;
  }

  & .btn-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & .ico-btn {
    display: block;
    width: 5.8rem;
    height: 5.8rem;
  }
`;
