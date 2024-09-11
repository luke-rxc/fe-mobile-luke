import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { UniversalLinkTypes, AppLinkTypes } from '@constants/link';
import { isHexColor, convertHexToRGBA } from '@utils/color';
import { format, isToday, getMinutes } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getAppLink } from '@utils/link';
import { useLink } from '@hooks/useLink';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Action } from '@pui/action';
import { Button } from '@pui/button';
import { Image } from '@pui/image';
import { SVG } from '@pui/svg';
import { Profiles } from '@pui/profiles';

const toScheduleDateFormat = (date: number, onAir?: boolean) => {
  const baseFormat = 'M. d a h시 m분';
  const onAirFormat = '지금 a h시 m분';
  const todayFormat = '오늘 a h시 m분';

  // eslint-disable-next-line no-nested-ternary
  const selectedFormat = onAir ? onAirFormat : isToday(date) ? todayFormat : baseFormat;
  const fixedFormat = getMinutes(date) ? selectedFormat : selectedFormat.replace('m분', '').trimEnd();

  const formatted = format(date, fixedFormat, { locale: ko });

  return formatted;
};

const getGradient = (colorCode: string, defaultColorCode: string) => {
  const color = isHexColor(colorCode) ? colorCode : defaultColorCode;

  return `linear-gradient(${convertHexToRGBA(color, 0)} 0%, ${color} 100%)`;
};

const getLiveCardLink = (
  data: Pick<
    LiveListItemProps,
    'onAir' | 'liveId' | 'contentCode' | 'contentType' | 'scheduleId' | 'landingType' | 'web' | 'scheme'
  >,
) => {
  const { isApp } = useDeviceDetect();
  const { getLink } = useLink();
  const { web, scheme, onAir, liveId, contentCode, contentType, scheduleId, landingType } = data;

  if (isApp && scheme) {
    return scheme;
  }
  if (!isApp && web) {
    return web;
  }

  if (onAir && liveId) {
    return getLink(UniversalLinkTypes.LIVE, { liveId });
  }

  if (landingType === 'STORY' && contentCode && contentType) {
    return getLink(UniversalLinkTypes.CONTENT, { contentCode, contentType: contentType.toLowerCase() });
  }

  if ((landingType === 'MODAL' || landingType === 'SCHEDULE_TEASER') && scheduleId && isApp) {
    return getAppLink(AppLinkTypes.SCHEDULE_TEASER, { contentsScheduleId: scheduleId });
  }

  return '#none';
};

export interface LiveListItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 방송여부 */
  onAir?: boolean;
  /** 라이브 ID */
  liveId?: number;
  /** 콘텐츠 코드 */
  contentCode?: string;
  /** 콘텐츠 타입 */
  contentType?: string;
  /** 스케줄 ID */
  scheduleId?: string | number;
  /** 라이브 제목 */
  title: string;
  /** 라이브 예정일 */
  scheduleDate: number;
  /** 브랜드 SVG 로고 */
  logoURL?: string;
  /** 크로마키 이미지 */
  chromakeyURL: string;
  /** 배경 이미지 */
  backgroundURL: string;
  /**
   * 로고 그라디언트배경 색상
   * @default #000000
   */
  bgColorCode?: string;
  /** 알림신청 여부 */
  followed?: boolean;
  /** 쇼룸 Id */
  showroomId?: number;
  /** 쇼룸(브랜드)명 */
  showroomName?: string;
  /** 쇼룸코드 */
  showroomCode?: string;
  /** 프로필 이미지 URL */
  profileURL?: string;
  /**
   * 랜딩 타입(deprecated MODAL)
   */
  landingType?: 'SCHEDULE_TEASER' | 'MODAL' | 'STORY';
  /** web 랜딩 URL */
  web?: string;
  /** app 랜딩 URL */
  scheme?: string;
  /** 알림신청or해지실 실행할 콜백(현재 알림신청 상태를 파라미터로 전달함) */
  onChangeFollow?: (follow: boolean, item: LiveListItemProps) => void;
  /** 링크 클릭 */
  onClickLink?: (event: React.MouseEvent<HTMLAnchorElement>, item: LiveListItemProps) => void;
}

const LiveListItemComponent = forwardRef<HTMLSpanElement, LiveListItemProps>((props, ref) => {
  const {
    title,
    scheduleDate,
    onAir,
    liveId,
    contentCode,
    contentType,
    scheduleId,
    logoURL,
    chromakeyURL,
    backgroundURL,
    bgColorCode,
    followed = false,
    showroomCode,
    profileURL,
    showroomId,
    showroomName,
    landingType,
    web,
    scheme,
    onChangeFollow,
    onClickLink,
    ...rest
  } = props;

  const link = getLiveCardLink({ onAir, liveId, contentCode, contentType, scheduleId, landingType, web, scheme });

  const handleChangeFollow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    onChangeFollow?.(followed, props);
  };

  const handleClickLink = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    onClickLink?.(e, props);
  };

  return (
    <span ref={ref} {...rest}>
      <Action is="a" link={link} className="live-button-link" onClick={handleClickLink}>
        <span className="live-thumb">
          <span className="background" children={<Image noFadeIn src={backgroundURL} />} />
          <span className="chromakey" children={<Image noFadeIn src={chromakeyURL} />} />
          <span className="gradient" />
          {logoURL && <span className="logo" children={<SVG src={logoURL} />} />}
        </span>
        <span className="live-info">
          <span className="title">{title}</span>
          <span className="date">{toScheduleDateFormat(scheduleDate, onAir)}</span>
        </span>
      </Action>

      {onAir && liveId && showroomCode && (
        <Action is="a" className="live-button-profile" link={link}>
          <Profiles
            disabledLink
            status="live"
            size={48}
            liveId={liveId}
            showroomCode={showroomCode}
            image={{ src: profileURL || '', lazy: true }}
          />
          {showroomName && <span className="name">{showroomName}</span>}
        </Action>
      )}

      {!onAir && (
        <Button
          bold
          disabled={onAir}
          size="bubble"
          className="live-button-follow"
          variant="primary"
          selected={followed}
          onClick={handleChangeFollow}
        >
          {followed ? '알림 받는 중' : '알림 신청'}
        </Button>
      )}
    </span>
  );
});

/**
 * Figma LiveListItem 컴포넌트
 */
export const LiveListItem = styled(LiveListItemComponent)`
  display: block;
  position: relative;

  .live-button-link {
    display: block;
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24}`};
    height: 15.2rem;
    background: ${({ theme }) => theme.color.background.surface};
    transition: background 0.2s;

    &${Action}:active {
      background: ${({ theme }) => theme.color.states.pressedCell};
    }
  }

  .live-thumb {
    float: left;
    overflow: hidden;
    position: relative;
    z-index: 0;
    width: 9.6rem;
    height: 12.4rem;
    transform: translate3d(0, 0, 0);
    border-radius: ${({ theme }) => theme.radius.r8};
    line-height: 0;

    &:after {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4.8rem;
      background: ${({ bgColorCode = '#000' }) => getGradient(bgColorCode, '#000')};
      opacity: 0.4;
      content: '';
    }

    .chromakey,
    .background {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 119%;
      height: 120%;
      border-radius: inherit;
      transform: translate3d(-50%, -50%, 0);

      ${Image} {
        background: transparent;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    .logo {
      position: absolute;
      bottom: 1.2rem;
      left: 50%;
      z-index: 1;
      width: 7.2rem;
      height: 2.4rem;
      transform: translate3d(-50%, 0, 0);
      transition: transform 700ms ease;
      will-change: transform;

      ${SVG} {
        width: 100%;
        height: 100%;
      }

      & * {
        fill: #fff !important;
        filter: none !important;
      }
    }
  }

  .live-info {
    display: block;
    overflow: hidden;
    padding-top: 2rem;
    padding-left: 1.6rem;

    .title {
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font: ${({ theme }) => theme.fontType.mediumB};
      color: ${({ theme }) => theme.color.text.textPrimary};
      margin-bottom: ${({ theme }) => theme.spacing.s4};
    }

    .date {
      display: block;
      font: ${({ theme }) => theme.fontType.mini};
      color: ${({ theme }) => theme.color.text.textTertiary};
    }
  }

  .live-button-profile {
    ${({ theme }) => theme.mixin.absolute({ l: 128, b: 30 })};
    ${({ theme }) => theme.mixin.centerItem()};

    ${Profiles} .inner {
      &:before {
        z-index: 1;
        border-radius: 50%;
      }
    }

    .name {
      margin-left: 0.5rem;
      color: ${({ theme }) => theme.color.text.textPrimary};
      font: ${({ theme }) => theme.fontType.small};
    }

    &:active {
      ${Profiles} .inner {
        transform: scale(0.96);
        transition: transform 0.2s;

        &:before {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${({ theme }) => theme.color.black};
          opacity: 0.1;
          content: '';
        }
      }
    }
  }

  .live-button-follow {
    position: absolute;
    left: 13.6rem;
    bottom: 3.4rem;
    z-index: 1;
  }
`;
