import { forwardRef, useRef, useImperativeHandle, useState, useMemo, useEffect, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { useIntersection } from '@hooks/useIntersection';
import { Button } from '@pui/button';
import { Image } from '@pui/image';
import { getImageLink } from '@utils/link';
import { AppearType, MediaType } from '../../../constants';
import type { DrawAProps, DrawAComponentRefModel } from '../../../models';
import { usePresetDrawAService, useLogService } from '../../../services';
import { AppearBox } from '../AppearBox';

const DrawAComponent = forwardRef<DrawAComponentRefModel, DrawAProps>(
  ({ className, backgroundMedia, displayDateTime, visible, eventList, contentInfo }, ref) => {
    const { inView, subscribe } = useIntersection(); // 뷰포트 교차
    const { logPresetDrawInit } = useLogService();

    const containerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null); // 전체 영역 el
    const isFirstVisibleSection = useRef<boolean>(false);
    const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태

    useImperativeHandle(ref, () => ({
      ref: containerRef.current as HTMLDivElement,
    }));

    if (!visible) {
      return <div ref={containerRef} className={className} />;
    }

    const eventValue = useMemo(() => {
      return eventList[0];
    }, [eventList]);

    const { isButtonDisabled, isButtonLabel, handleOpenDrawModal } = usePresetDrawAService({
      drawEvent: eventValue,
      displayDateTime,
      contentInfo,
    });

    useEffect(() => {
      if (sectionRef.current) {
        subscribe(sectionRef.current, { threshold: 0 });
      }
    }, [sectionRef, subscribe]);

    useEffect(() => {
      if (!visible) return;
      if (inView && isFirstVisibleSection.current === false) {
        isFirstVisibleSection.current = true;
        logPresetDrawInit(contentInfo, { eventId: eventValue.id, raffleType: 'default' });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    return (
      <div ref={containerRef} className={className}>
        {visible && (
          <div ref={sectionRef} className="content-wrapper">
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
                      <AppearBox appear={AppearType.FROM_BOTTOM}>
                        <Button
                          variant="primary"
                          size="large"
                          disabled={isButtonDisabled}
                          onClick={handleOpenDrawModal}
                        >
                          {isButtonLabel}
                        </Button>
                      </AppearBox>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

/**
 * 쿠폰 컴포넌트
 */
export const DrawA = styled(DrawAComponent)`
  & .content-wrapper {
    position: relative;
    padding: 2.4rem 0 4.8rem 0;
    background-color: ${({ backgroundInfo }) => backgroundInfo.color};
  }
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
  & .contents {
    position: relative;
  }

  & .button-wrapper {
    padding: 0 2.4rem;

    ${Button} {
      width: 100%;
      font: ${({ theme }) => theme.content.contentStyle.fontType.mediumB};
      color: ${({ button, theme }) => button.color || theme.color.white};
      background: ${({ button, theme }) => button.background || theme.color.brand.tint};
      &:disabled {
        color: ${({ theme }) => theme.color.text.textDisabled};
        background: ${({ theme }) => theme.color.states.disabledBg};
      }
    }
  }
`;
