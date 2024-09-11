import { forwardRef, Fragment, useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '@pui/button';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import { MediaType } from '../../../constants';
import { useIntersection } from '../../../hooks';
import type { ContentLogInfoModel, DrawADisplayModel, PresetComponentModel, PresetRefModel } from '../../../models';
import { useLogService, usePresetDrawAService } from '../../../services';
import { useContentStore } from '../../../stores';
import { AppearTransition } from '../AppearTransition';

const DrawAComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents, eventList } = preset;

  if (!visible) {
    return <div ref={ref} {...props} />;
  }

  const displayValues = JSON.parse(contents) as DrawADisplayModel;
  const { backgroundMedia } = displayValues;
  const contentInfo = useContentStore.use.contentInfo();
  const contentLogInfo: ContentLogInfoModel = useMemo(() => {
    return {
      ...contentInfo,
      presetId,
      presetType,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { logPresetDrawInit } = useLogService();
  const { sectionRef, inView } = useIntersection({ once: true });

  const eventValue = useMemo(() => {
    return eventList[0];
  }, [eventList]);

  const { isButtonDisabled, buttonLabel, handleOpenDrawModal } = usePresetDrawAService({
    drawEvent: eventValue,
    displayDateTime: contentInfo.dateTime,
    contentLogInfo,
  });

  const [errorMedia, setErrorMedia] = useState<boolean>(false); // 미디어 에러상태

  useEffect(() => {
    if (inView) {
      logPresetDrawInit(contentLogInfo, { eventId: eventValue.id, raffleType: 'default' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div ref={ref} {...props}>
      {visible && (
        <DrawAContent className="content-wrapper" ref={sectionRef} {...displayValues}>
          <div className="bg">
            {!errorMedia && (
              <>
                {backgroundMedia.type === MediaType.IMAGE && (
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
            <div className="button-wrapper">
              {eventList.map((drawEvent) => {
                return (
                  <Fragment key={`draw-${drawEvent.id}`}>
                    <AppearTransition transition>
                      <Button variant="primary" size="large" disabled={isButtonDisabled} onClick={handleOpenDrawModal}>
                        {buttonLabel}
                      </Button>
                    </AppearTransition>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </DrawAContent>
      )}
    </div>
  );
});
const DrawA = styled(DrawAComponent)``;
export default DrawA;

const DrawAContent = styled('div').attrs((props: DrawADisplayModel) => props)`
  position: relative;
  padding: 2.4rem 0 4.8rem 0;
  background-color: ${({ backgroundInfo }) => backgroundInfo.color};

  & .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    img,
    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
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

  & .contents {
    position: relative;
  }

  & .button-wrapper {
    padding: 0 2.4rem;

    ${Button} {
      width: 100%;
      background: ${({ button, theme }) => button.background || theme.color.brand.tint};
      color: ${({ button, theme }) => button.color || theme.color.white};
      font: ${({ theme }) => theme.content.contentStyle.fontType.mediumB};

      &:disabled {
        background: ${({ theme }) => theme.color.states.disabledBg};
        color: ${({ theme }) => theme.color.text.textDisabled};
      }
    }
  }
`;
