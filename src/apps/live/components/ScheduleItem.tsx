import styled, { keyframes } from 'styled-components';
import { useTheme } from '@hooks/useTheme';
import { SVG } from '@pui/svg';
import { Image } from '@pui/image';
import { ScheduleItemModel } from '../models';
import { BellIcon } from './BellIcon';
import { useScheduleSwiperInView } from '../hooks';
import { LiveActionType } from '../constants';
import { LiveActionProps } from '../types';

export interface ScheduleItemProps {
  opened: boolean;
  item: ScheduleItemModel;
  onClickUserAction: (path: LiveActionType, actionProps?: LiveActionProps) => (event: React.MouseEvent) => void;
  onClickOpenContents: (item: ScheduleItemModel) => (event: React.MouseEvent) => void;
}

export const ScheduleItem = ({
  opened,
  item,
  onClickUserAction: handleClickUserAction,
  onClickOpenContents: handleClickOpenContents,
}: ScheduleItemProps) => {
  const { id: scheduleId, bgImage, chromakeyImage, svgLogo, title, scheduleDateText, bgColor, liveSchedule } = item;
  const { inView, wrapperRef } = useScheduleSwiperInView({ opened });
  const { theme } = useTheme();

  return (
    <InnerWrapperStyled ref={wrapperRef}>
      <InnerStyled onClick={handleClickOpenContents(item)}>
        <MediaWrapperStyled className={inView ? 'in-view' : ''}>
          <MediaBackgroundStyled>
            <Image src={bgImage.fullPath} />
          </MediaBackgroundStyled>
          <MediaChromakeyStyled>
            <Image src={chromakeyImage.fullPath} />
          </MediaChromakeyStyled>
          <GradientOverlayStyled color={bgColor} />
          <MediaPressedStyled className="pressed-area" />
          {svgLogo && (
            <MediaLogoStyled>
              <InlineSvgStyled
                className="logo-image"
                src={svgLogo.fullPath}
                fill={theme.color.white}
                width={svgLogo.width}
              />
            </MediaLogoStyled>
          )}
        </MediaWrapperStyled>
        <ContentStyled>
          <TitleStyled>{title}</TitleStyled>
          <TimeStyle>{scheduleDateText}</TimeStyle>
        </ContentStyled>
      </InnerStyled>
      <BellIcon scheduleId={scheduleId} followed={liveSchedule.isFollowed} onClick={handleClickUserAction} />
    </InnerWrapperStyled>
  );
};

const MediaPressedStyled = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.2s;
`;

const InnerWrapperStyled = styled.div`
  position: relative;
  margin-left: 0.8rem;
  margin-right: 0.8rem;
  margin-bottom: 2.2rem;
  user-select: none;

  &:focus {
    outline: none;
  }
`;

const GradientOverlayStyled = styled.div<{ color: string }>`
  position: absolute;
  width: calc((100vw - 8rem) / 2);
  max-width: 16.7rem;
  height: 7.2rem;
  bottom: 0;
  left: 0;
  transform: translate3d(0, 0, 0);
  will-change: transform;

  background: ${({ color }) => `linear-gradient(180deg, rgba(110, 0, 255, 0) 0%, ${color} 100%);`};
  opacity: 0.4;
`;

const InnerStyled = styled.div`
  display: block;
  width: calc((100vw - 8rem) / 2);
  max-width: 16.7rem;
  -webkit-tap-highlight-color: transparent;

  &:active {
    ${MediaPressedStyled} {
      opacity: 1;
    }
  }
`;

const moveItem = (y: string) => keyframes`
 100%{
   transform: translateY(${y});
 }
`;

const MediaBackgroundStyled = styled.div`
  position: absolute;
  width: calc((100vw - 8rem) / 2 + 2.4rem);
  max-width: 19.1rem;
  top: -12px;
  left: -12px;
  object-fit: cover;
  transform: translate3d(0, 0, 0);
  will-change: transform;
`;

const MediaChromakeyStyled = styled.div`
  position: absolute;
  width: calc((100vw - 8rem) / 2 + 2.4rem);
  max-width: 19.1rem;
  top: -8px;
  left: -12px;
  object-fit: cover;
  transform: translate3d(0, 0, 0);
  will-change: transform;

  > span {
    background: none;
  }
`;

const MediaLogoStyled = styled.div`
  position: absolute;
  width: 100%;
  height: 3.2rem;
  bottom: 0;
  left: 0;
  text-align: center;
  transform: translate3d(0, 0, 0);
  will-change: transform;
`;

const MediaWrapperStyled = styled.a`
  display: flex;
  justify-content: center;
  overflow: hidden;
  position: relative;
  padding-top: 133.59375%;
  border-radius: 0.8rem;
  -webkit-touch-callout: none;
  z-index: 0;

  &.in-view {
    ${MediaBackgroundStyled} {
      animation: ${moveItem('-4px')} 700ms forwards ease;
    }

    ${MediaChromakeyStyled} {
      animation: ${moveItem('-8px')} 700ms forwards ease;
    }

    ${MediaLogoStyled} {
      animation: ${moveItem('-16px')} 700ms forwards ease;
    }
  }
`;

const ContentStyled = styled.div`
  padding-top: 1.2rem;
`;

const TitleStyled = styled.div`
  display: -webkit-box;
  font: ${({ theme }) => theme.fontType.t14B};
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
const TimeStyle = styled.div`
  margin-top: 0.4rem;
  font: ${({ theme }) => theme.fontType.t12};
  color: ${({ theme }) => theme.color.gray50};
`;

const InlineSvgStyled = styled(SVG)<{ width: number }>`
  *:not(g) {
    fill: ${({ theme }) => theme.light.color.white} !important;
  }

  ${({ width }) =>
    (width || 0) > 104
      ? `
        height: auto;
        width: 100%;
        padding: 0 1.2rem;
      `
      : `
        height: 3.2rem;
        width: auto;
      `}
`;
