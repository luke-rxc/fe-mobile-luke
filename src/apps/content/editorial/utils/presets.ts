import findLastIndex from 'lodash/findLastIndex';
import { differenceInCalendarDays, differenceInHours } from 'date-fns';
import { UniversalLinkTypes } from '@constants/link';
import { ContentType } from '@constants/content';
import { ImageStatus } from '@hooks/useImageLoader';
import { useLink } from '@hooks/useLink';
import { getImageLink } from '@utils/link';
import { toHHMMSS } from '@utils/toTimeformat';
import { LandingActionType } from '../constants';
import type { LandingActionModel } from '../models';

/**
 * Swiper 의 css scroll snap (cssMode)를 사용할 수 있는 여부 결정
 * @issue scroll-snap-stop 은 ios 14.8 까지는 지원되지 않음
 */
export const getSwiperCssModeAble = (isIos: boolean, osMajorVersion: number | null): boolean => {
  if (isIos && osMajorVersion !== null) {
    return osMajorVersion >= 15;
  }

  return false;
};

/**
 * 컴포넌트 노출 여부
 * @returns
 */
export const getStatusVisible = ({
  useDisplayDateTime,
  displayStartDateTime,
  displayEndDateTime,
  displayDateTime,
}: {
  /** 노출 예약시간 사용여부 */
  useDisplayDateTime: boolean;
  /** 노출 시작시간 */
  displayStartDateTime: string;
  /** 노출 종료 시간 */
  displayEndDateTime: string;
  /** 노출 현재 시점 */
  displayDateTime: string;
}) => {
  if (useDisplayDateTime) {
    const currentTime = displayDateTime ? new Date(displayDateTime).getTime() : new Date().getTime();
    const startTime = displayStartDateTime ? new Date(displayStartDateTime).getTime() : null;
    const endTime = displayEndDateTime ? new Date(displayEndDateTime).getTime() : null;

    if (startTime && endTime) {
      return startTime <= currentTime && currentTime < endTime;
    }

    if (startTime) {
      return startTime <= currentTime;
    }

    if (endTime) {
      return currentTime < endTime;
    }

    return false;
  }
  // 상시 노출
  return true;
};

/**
 * 프레임별 이미지 path 추출
 */
export const getFrameImagePath = ({
  frameNum,
  middlePath,
  fileName,
  extension,
  fixedNum = 3,
}: {
  /** 프레임넘버 */
  frameNum: number;
  /** 파일 경우 */
  middlePath: string;
  /** 파일명 prefix */
  fileName: string;
  /** 확장자 */
  extension: string;
  /** 자리수 */
  fixedNum?: number;
}) => {
  const str = ``.padStart(fixedNum, '0');
  let frameIndex = `${str}${frameNum + 1}`;
  if (frameIndex.length > fixedNum) {
    frameIndex = frameIndex.substring(frameIndex.length - fixedNum, frameIndex.length);
  }

  return getImageLink(`${middlePath}/${fileName}${frameIndex}.${extension}`);
};

/**
 * 유효한 이미지 프레임 number 조회
 */
export const getValidImageFrame = (frame: number, imageStatusData: ImageStatus[]) => {
  let targetFrame = 0;

  if (!imageStatusData[frame]) {
    return targetFrame;
  }

  const { status } = imageStatusData[frame];
  if (status === 'success') {
    targetFrame = frame;
    return targetFrame;
  }

  // 이미지 에러일때, success된 이미지 프레임 index 조회
  const nextList = imageStatusData.slice(frame + 1);
  const nextIndex = nextList.findIndex((value) => value.status === 'success');

  if (nextIndex > 0) {
    targetFrame = frame + nextIndex;
  } else {
    const prevList = imageStatusData.slice(0, frame);
    targetFrame = findLastIndex(prevList, (value) => value.status === 'success');
  }
  return targetFrame;
};

/** 랜딩 링크 조회 */
export const getLandingLink = (actions: LandingActionModel): string => {
  const { getLink } = useLink();

  const { actionType, value } = actions;
  if (actionType === LandingActionType.GOODS) {
    return getLink(UniversalLinkTypes.GOODS, { goodsCode: value });
  }
  if (actionType === LandingActionType.SHOWROOM) {
    return getLink(UniversalLinkTypes.SHOWROOM, {
      showroomCode: value,
    });
  }
  if (actionType === LandingActionType.CONTENT_STORY) {
    return getLink(UniversalLinkTypes.CONTENT, {
      contentType: ContentType.STORY.toLowerCase(),
      contentCode: value,
    });
  }
  if (actionType === LandingActionType.CONTENT_TEASER) {
    return getLink(UniversalLinkTypes.CONTENT, {
      contentType: ContentType.TEASER.toLowerCase(),
      contentCode: value,
    });
  }
  return '';
};

/** 랜딩 타입 조회 */
export const getLandingType = (actions: LandingActionModel): string => {
  const { actionType } = actions;
  switch (actionType) {
    case LandingActionType.GOODS:
      return 'goods';
    case LandingActionType.SHOWROOM:
      return 'showroom';
    case LandingActionType.CONTENT_STORY:
    case LandingActionType.CONTENT_TEASER:
      return 'content';
    default:
      return '';
  }
};

/** w/h 비율에 따른 세로 높이 value */
export const getViewHeightForRatio = (w: number, h: number) => {
  const ratio = h / w;
  const wWidth = window.innerWidth;
  return Math.floor(ratio * wWidth); // 정수 처리
};

/**
 * 카운트다운 value 조회
 * 24시간 이상 D-day
 * 24시간 미만 카운트다운
 */
export const handleGetDDayValue = (reachTime: number, compareTime: number) => {
  const distance = reachTime - compareTime;
  const diffRemainDay = differenceInCalendarDays(reachTime, compareTime);
  const diffRemainHours = differenceInHours(reachTime, compareTime);
  const remainValue = diffRemainHours < 24 ? 0 : diffRemainDay;

  return remainValue > 0 ? `D-${remainValue}` : toHHMMSS(distance);
};
