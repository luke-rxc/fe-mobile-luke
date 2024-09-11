import { useState, forwardRef, useRef, useEffect, useImperativeHandle, useCallback } from 'react';
import styled from 'styled-components';
import { AppLinkTypes } from '@constants/link';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useIntersection } from '@hooks/useIntersection';
import { Action } from '@pui/action';
import { Image } from '@pui/image';
import { getAppLink, getImageLink } from '@utils/link';
import type { BannerComponentRefModel, BannerProps } from '../../../models';
import { useLogService } from '../../../services';
import { getViewHeightForRatio } from '../../../utils';

const BannerComponent = forwardRef<BannerComponentRefModel, BannerProps>(
  ({ image, contentInfo, className, actions, useActions, visible }, ref) => {
    const { isApp } = useDeviceDetect();
    const [errorMedia, setErrorMedia] = useState<boolean>(false); // 미디어 에러상태
    const { logPresetBannerInit, logPresetBannerTab } = useLogService();
    const { inView, subscribe } = useIntersection(); // 뷰포트 교차
    const containerRef = useRef<HTMLDivElement>(null);
    const isFirstVisibleSection = useRef<boolean>(false);
    const targetLink = isApp ? getAppLink(AppLinkTypes.EXTERNAL_WEB, { url: actions.value }) : actions.value;
    const link = useActions ? targetLink : '';

    const handleAction = useCallback(() => {
      if (!actions) {
        return;
      }
      logPresetBannerTab(contentInfo, actions);
    }, [actions, contentInfo, logPresetBannerTab]);

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
        logPresetBannerInit(contentInfo);
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
          <Action is="a" link={link} target="_blank" onClick={handleAction}>
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
          </Action>
        )}
      </div>
    );
  },
);

/**
 * 배너 컴포넌트
 */
export const Banner = styled(BannerComponent)`
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
