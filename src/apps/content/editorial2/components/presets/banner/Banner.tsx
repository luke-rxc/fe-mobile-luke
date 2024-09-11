import { forwardRef, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { AppLinkTypes } from '@constants/link';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Action } from '@pui/action';
import { Image } from '@pui/image';
import { getAppLink, getImageLink } from '@utils/link';
import { useIntersection } from '../../../hooks';
import type { BannerDisplayModel, ContentLogInfoModel, PresetComponentModel, PresetRefModel } from '../../../models';
import { useLogService } from '../../../services';
import { useContentStore } from '../../../stores';
import { getViewHeightForRatio } from '../../../utils';

const BannerComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents } = preset;
  const displayValues = JSON.parse(contents) as BannerDisplayModel;
  const { image, actions, useActions } = displayValues;
  const contentInfo = useContentStore.use.contentInfo();
  const contentLogInfo: ContentLogInfoModel = useMemo(() => {
    return {
      ...contentInfo,
      presetId,
      presetType,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { logPresetBannerInit, logPresetBannerTab } = useLogService();
  const { sectionRef, inView } = useIntersection({ once: true });
  const { isApp } = useDeviceDetect();
  const [viewHeight, setViewHeight] = useState(0);
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // 미디어 에러상태
  const targetLink = isApp ? getAppLink(AppLinkTypes.EXTERNAL_WEB, { url: actions.value }) : actions.value;
  const link = useActions ? targetLink : '';

  const handleAction = () => {
    if (!actions) {
      return;
    }
    logPresetBannerTab(contentLogInfo, actions);
  };

  // 고정 비율시 높이 설정
  const handleSetViewHeight = () => {
    const targetViewHeight = getViewHeightForRatio(image.width, image.height);
    setViewHeight(targetViewHeight);
  };

  useEffect(() => {
    if (inView) {
      logPresetBannerInit(contentLogInfo);
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
    <div ref={ref} {...props}>
      {visible && (
        <BannerContent className="content-wrapper" ref={sectionRef} {...displayValues}>
          <Action is="a" link={link} target="_blank" onClick={handleAction}>
            {!errorMedia && (
              <Image
                {...(viewHeight && { height: `${viewHeight / 10}rem` })}
                src={getImageLink(image.path)}
                blurHash={image.blurHash}
                onError={() => setErrorMedia(true)}
                lazy
              />
            )}
            {errorMedia && (
              <div
                className="overlay-error"
                style={{
                  paddingTop: `${(image.height / image.width) * 100}%`,
                }}
              />
            )}
          </Action>
        </BannerContent>
      )}
    </div>
  );
});
const Banner = styled(BannerComponent)``;
export default Banner;

const BannerContent = styled('div').attrs((props: BannerDisplayModel) => props)`
  .overlay-error {
    width: 100%;
    height: 0;
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
