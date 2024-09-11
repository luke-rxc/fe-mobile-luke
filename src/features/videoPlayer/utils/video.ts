import { VideoProps } from '@pui/video';

/**
 * 초기 음소거 상태 설정
 * ios에서 강제 autoplay를 실행하기 위해 mute 처리
 * autoplay 옵션 설정
 * - muted 옵션 true: sound off
 * - muted 옵션 false: sound off
 * - muted 옵션 설정 x: sound off
 *
 * autoplay 옵션 설정 x
 * - muted 옵션 true: sound off
 * - muted 옵션 false: sound on
 * - muted 옵션 설정 x: sound on
 */
export const getInitMuteState = (video: VideoProps) => {
  const { autoPlay, muted } = video;
  if (autoPlay === true) {
    return true;
  }

  return !!muted;
};
