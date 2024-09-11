import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as LogoPrizm } from '@assets/logo_prizm.svg';
import { useIntersection } from '@hooks/useIntersection';
import { Image } from '@pui/image';
import { Profiles, ProfilesProps } from '@pui/profiles';
import nl2br from '@utils/nl2br';
import { getImageLink } from '@utils/link';
import { toDateFormat } from '@utils/date';
import { ContentsBackgroundType } from '../../../constants';
import type { FooterComponentRefModel, FooterProps } from '../../../models';
import { useLogService } from '../../../services';

const FooterComponent = forwardRef<FooterComponentRefModel, FooterProps>(
  (
    {
      className,
      showroomId,
      showroomCode,
      showroomName,
      showroomImage,
      onAir,
      liveId,
      notice,
      backgroundInfo,
      backgroundMedia,
      contentInfo,
    },
    ref,
  ) => {
    const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태
    const profileProps: ProfilesProps = {
      showroomCode,
      liveId,
      image: { src: showroomImage.path },
      size: 144,
      status: liveId ? 'live' : 'none',
      noResize: true,
    };
    const { logPresetFooterInit, logPresetFooterProfileTab } = useLogService();
    const { inView, subscribe } = useIntersection(); // 뷰포트 교차
    const containerRef = useRef<HTMLDivElement>(null);
    const isFirstVisibleSection = useRef<boolean>(false);
    const currentYear = toDateFormat(Date.now(), 'yyyy');

    const handleProfileTab = useCallback(() => {
      logPresetFooterProfileTab({
        contentId: contentInfo.contentId,
        contentName: contentInfo.contentName,
        showroomId,
        showroomName,
        liveId,
        onAir,
      });
    }, [
      contentInfo.contentId,
      contentInfo.contentName,
      liveId,
      logPresetFooterProfileTab,
      onAir,
      showroomId,
      showroomName,
    ]);
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
      if (inView && isFirstVisibleSection.current === false) {
        isFirstVisibleSection.current = true;
        logPresetFooterInit(contentInfo);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    return (
      <div className={className} ref={containerRef}>
        <div className="bg-wrapper">
          {backgroundInfo.type === ContentsBackgroundType.MEDIA && (
            <div className="bg">
              {!errorMedia && (
                <Image
                  src={getImageLink(backgroundMedia.path)}
                  blurHash={backgroundMedia.blurHash}
                  onError={() => setErrorMedia(true)}
                  lazy
                />
              )}
              {errorMedia && <div className="overlay-error" />}
            </div>
          )}
        </div>
        <div className="contents">
          <div className="inner">
            <Profiles {...profileProps} onClick={handleProfileTab} />
            {showroomName && <p className="title">{nl2br(showroomName)}</p>}
            {notice && <p className="notice">{nl2br(notice)}</p>}
            <div className="logo">
              <LogoPrizm className="prizm-logo" />
            </div>
            <p className="copy">&copy; {currentYear} RXC</p>
          </div>
        </div>
      </div>
    );
  },
);

/**
 * 푸터 컴포넌트
 */
export const Footer = styled(FooterComponent)`
  position: relative;
  .bg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: middle;
    }
    .overlay-error {
      width: 100%;
      height: 100%;
      background: ${({ theme }) => theme.color.gray8};
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &:after {
      ${({ isOverlay }) => {
        if (isOverlay) {
          return css`
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            display: block;
            background: ${({ theme }) => theme.color.gray50};
            content: '';
          `;
        }
        return null;
      }}
    }
  }
  .contents {
    padding-top: 5.6rem;
    padding-left: 1.6rem;
    padding-right: 1.6rem;
    ${({ theme }) => theme.mixin.safeArea('padding-bottom', 88)};
    color: ${({ color, theme }) => color || theme.color.text.textPrimary};
    text-align: center;
    background-color: ${({ backgroundInfo }) =>
      `${backgroundInfo.type === ContentsBackgroundType.COLOR ? backgroundInfo.color : ''}`};
    & > .inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      & .title {
        font: ${({ theme }) => theme.content.contentStyle.fontType.titleB};
        word-break: break-all;
      }
      .notice {
        margin-top: 0.8rem;
        opacity: 0.6;
        font: ${({ theme }) => theme.content.contentStyle.fontType.micro};
        color: ${({ color }) => color};
      }
      .logo {
        position: relative;
        width: 10.3rem;
        margin: 7.9rem auto 0;
        display: flex;
        justify-content: center;

        & *[fill] {
          fill: ${({ color, theme }) => (color ? `${color}!important` : theme.color.gray50)};
        }
        & *[stroke] {
          stroke: ${({ color, theme }) => (color ? `${color}!important` : theme.color.gray50)};
        }

        .prizm-logo {
          width: 100%;
          height: 100%;
        }
      }

      .copy {
        margin-top: 0.8rem;
        opacity: 0.6;
        font: ${({ theme }) => theme.content.contentStyle.fontType.micro};
        color: ${({ color }) => color};
      }
    }
  }
`;
