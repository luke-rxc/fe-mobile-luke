import { forwardRef, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Action } from '@pui/action';
import { Conditional } from '@pui/conditional';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import { useIntersection } from '../../../hooks';
import type {
  ContentLogInfoModel,
  ImageViewerDisplayModel,
  PresetComponentModel,
  PresetRefModel,
} from '../../../models';
import { useLogService } from '../../../services';
import { useContentStore } from '../../../stores';
import { getLandingLink, getViewHeightForRatio } from '../../../utils';

const ImageViewerComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents } = preset;
  const displayValues = JSON.parse(contents) as ImageViewerDisplayModel;
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
  const { logPresetImageViewerInit, logPresetImageViewerTab } = useLogService();
  const { sectionRef, inView } = useIntersection({ once: true });
  const [viewHeight, setViewHeight] = useState(0);
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // 미디어 에러상태
  const link = useActions ? getLandingLink(actions) : '';

  // 고정 비율시 높이 설정
  const handleSetViewHeight = () => {
    const targetViewHeight = getViewHeightForRatio(image.width, image.height);
    setViewHeight(targetViewHeight);
  };

  const handleAction = () => {
    if (!actions) {
      return;
    }
    logPresetImageViewerTab(contentLogInfo, actions);
  };

  useEffect(() => {
    if (inView) {
      logPresetImageViewerInit(contentLogInfo);
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
        <ImageViewerContent className="content-wrapper" ref={sectionRef} {...displayValues}>
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
        </ImageViewerContent>
      )}
    </div>
  );
});
const ImageViewer = styled(ImageViewerComponent)``;
export default ImageViewer;

const ImageViewerContent = styled('div').attrs((props: ImageViewerDisplayModel) => props)`
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
