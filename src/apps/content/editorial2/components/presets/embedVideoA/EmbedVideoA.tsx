import { forwardRef, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { AppLinkTypes } from '@constants/link';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Action } from '@pui/action';
import { Image } from '@pui/image';
import { VideoPlay } from '@pui/lottie';
import { theme as styleTheme } from '@styles/theme';
import { getAppLink } from '@utils/link';
import { useIntersection } from '../../../hooks';
import type {
  EmbedVideoADisplayModel,
  ContentLogInfoModel,
  PresetComponentModel,
  PresetRefModel,
} from '../../../models';
import { useLogService } from '../../../services';
import { useContentStore } from '../../../stores';
import { getViewHeightForRatio } from '../../../utils';

const EmbedVideoAComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { presetType, presetId, contents, visible } = preset;
  const displayValues = JSON.parse(contents) as EmbedVideoADisplayModel;
  const { embedId, link } = displayValues;
  const contentInfo = useContentStore.use.contentInfo();
  const contentLogInfo: ContentLogInfoModel = useMemo(() => {
    return {
      ...contentInfo,
      presetId,
      presetType,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { logPresetEmbedVideoInit, logPresetEmbedVideoTab } = useLogService();
  const { sectionRef, inView } = useIntersection({ once: true });

  const { isApp } = useDeviceDetect();
  const videoUrl = isApp ? getAppLink(AppLinkTypes.EXTERNAL_WEB, { url: link }) : link;
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // 미디어 에러상태
  const [viewHeight, setViewHeight] = useState(0);

  const handleAction = () => {
    if (!link) {
      return;
    }
    logPresetEmbedVideoTab(contentLogInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  // 고정 비율시 높이 설정
  const handleSetViewHeight = () => {
    const targetViewHeight = getViewHeightForRatio(16, 9);
    setViewHeight(targetViewHeight);
  };

  useEffect(() => {
    handleSetViewHeight();
    window.addEventListener('resize', handleSetViewHeight);
    return () => {
      window.removeEventListener('resize', handleSetViewHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (inView) {
      logPresetEmbedVideoInit(contentLogInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div ref={ref} {...props}>
      {visible && (
        <EmbedVideoAContent className="content-wrapper" ref={sectionRef} {...displayValues}>
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
        </EmbedVideoAContent>
      )}
    </div>
  );
});
const EmbedVideoA = styled(EmbedVideoAComponent)``;
export default EmbedVideoA;

const EmbedVideoAContent = styled('div').attrs((props: EmbedVideoADisplayModel) => props)`
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
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  & .ico-btn {
    display: block;
    width: 5.8rem;
    height: 5.8rem;
  }
`;
