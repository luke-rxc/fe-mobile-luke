import { forwardRef, useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as LogoPrizm } from '@assets/logo_prizm.svg';
import { Image } from '@pui/image';
import { Profiles, ProfilesProps } from '@pui/profiles';
import { toDateFormat } from '@utils/date';
import { getImageLink } from '@utils/link';
import nl2br from '@utils/nl2br';
import { ContentsBackgroundType } from '../../../constants';
import { useIntersection } from '../../../hooks';
import type { ContentLogInfoModel, FooterDisplayModel, PresetComponentModel, PresetRefModel } from '../../../models';
import { useLogService } from '../../../services';
import { useContentStore } from '../../../stores';

const FooterComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents } = preset;
  const displayValues = JSON.parse(contents) as FooterDisplayModel;
  const { backgroundInfo, backgroundMedia } = displayValues;
  const contentInfo = useContentStore.use.contentInfo();
  const { id, name, code, primaryImage, liveId, onAir } = useContentStore.use.showroom();
  const contentLogInfo: ContentLogInfoModel = useMemo(() => {
    return {
      ...contentInfo,
      presetId,
      presetType,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { logPresetFooterInit, logPresetFooterProfileTab } = useLogService();
  const { sectionRef, inView } = useIntersection({ once: true });
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태
  const profileProps: ProfilesProps = {
    showroomCode: code,
    liveId,
    image: { src: primaryImage.path },
    size: 144,
    status: liveId ? 'live' : 'none',
    noResize: true,
  };
  const currentYear = toDateFormat(Date.now(), 'yyyy');

  const handleProfileTab = () => {
    logPresetFooterProfileTab(contentLogInfo, {
      showroomId: id,
      showroomName: name,
      liveId,
      onAir,
    });
  };

  useEffect(() => {
    if (inView) {
      logPresetFooterInit(contentLogInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div ref={ref} {...props}>
      {visible && (
        <FooterContent className="content-wrapper" ref={sectionRef} {...displayValues}>
          <div className="bg">
            {!errorMedia && (
              <>
                {backgroundInfo.type === ContentsBackgroundType.MEDIA && (
                  <Image
                    src={getImageLink(backgroundMedia.path)}
                    blurHash={backgroundMedia.blurHash}
                    onError={() => setErrorMedia(true)}
                    lazy
                  />
                )}
              </>
            )}
            {errorMedia && <div className="overlay-error" />}
          </div>

          <div className="contents">
            <div className="inner">
              <Profiles {...profileProps} onClick={handleProfileTab} />
              {name && <p className="title">{nl2br(name)}</p>}
              <p className="notice">
                쇼룸에 더 많은 상품이 있습니다
                <br />
                팔로우하면 라이브와 혜택 소식을 알려드립니다
              </p>
              <div className="logo">
                <LogoPrizm className="prizm-logo" />
              </div>
              <p className="copy">&copy; {currentYear} RXC</p>
            </div>
          </div>
        </FooterContent>
      )}
    </div>
  );
});
const Footer = styled(FooterComponent)``;
export default Footer;

const FooterContent = styled('div').attrs((props: FooterDisplayModel) => props)`
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
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: ${({ theme }) => theme.color.gray8};
    }

    &:after {
      ${({ isOverlay }) => {
        if (isOverlay) {
          return css`
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
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
    padding-right: 1.6rem;
    padding-left: 1.6rem;
    background-color: ${({ backgroundInfo }) =>
      `${backgroundInfo.type === ContentsBackgroundType.COLOR ? backgroundInfo.color : ''}`};
    ${({ theme }) => theme.mixin.safeArea('padding-bottom', 88)};
    color: ${({ color, theme }) => color || theme.color.text.textPrimary};

    text-align: center;

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
        color: ${({ color }) => color};
        font: ${({ theme }) => theme.content.contentStyle.fontType.micro};
      }

      .logo {
        display: flex;
        position: relative;
        justify-content: center;
        width: 10.3rem;
        margin: 7.9rem auto 0;

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
        color: ${({ color }) => color};
        font: ${({ theme }) => theme.content.contentStyle.fontType.micro};
      }
    }
  }
`;
