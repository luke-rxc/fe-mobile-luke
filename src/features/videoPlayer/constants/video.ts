/**
 * 비디오 이벤트 키
 * @reference https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
 */
export const VideoEventMap = {
  abort: 'abort',
  canplay: 'canplay',
  canplaythrough: 'canplaythrough',
  durationchange: 'durationchange',
  emptied: 'emptied',
  ended: 'ended',
  error: 'error',
  loadeddata: 'loadeddata',
  loadedmetadata: 'loadedmetadata',
  loadstart: 'loadstart',
  pause: 'pause',
  play: 'play',
  playing: 'playing',
  progress: 'progress',
  ratechange: 'ratechange',
  resize: 'resize',
  seeked: 'seeked',
  seeking: 'seeking',
  stalled: 'stalled',
  suspend: 'suspend',
  timeupdate: 'timeupdate',
  volumechange: 'volumechange',
  waiting: 'waiting',
  click: 'click',
} as const;

/**
 * 미디어의 준비 상태
 * @reference https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement/readyState
 */
export const VideoReadyState = {
  /** 미디어 리소스에 대한 정보가 없음 */
  HAVE_NOTHING: 0,
  /** 메타데이터 속성이 초기화될 만큼 충분한 미디어 리소스가 검색 */
  HAVE_METADATA: 1,
  /** 현재 재생 위치에 대한 데이터를 사용할 수 있지만 실제로 한 프레임 이상을 재생하기에는 충분하지 않음 */
  HAVE_CURRENT_DATA: 2,
  /** 현재 재생 위치 및 미래의 최소한의 시간에 대한 데이터를 사용할 수 있음(최소 두프레임이상 존재) */
  HAVE_FUTURE_DATA: 3,
  /** 충분한 데이터를 사용할 수 있고 다운로드 속도가 충분히 높아 미디어를 중단 없이 끝까지 재생 */
  HAVE_ENOUGH_DATA: 4,
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type VideoReadyState = typeof VideoReadyState[keyof typeof VideoReadyState];

/**
 * 비디오 에러타입
 */
export const VideoErrorState = {
  /** 사용자 요청에 의해 리소스 조회 중지 된 경우 */
  MEDIA_ERR_ABORTED: 1,
  /** 리소스를 가져올수 없는 네트워크 오류 발생 */
  MEDIA_ERR_NETWORK: 2,
  /** 리소스는 가져오지만 디코딩하는 동안 오류 발생 */
  MEDIA_ERR_DECODE: 3,
  /** not support */
  MEDIA_ERR_SRC_NOT_SUPPORTED: 4,
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type VideoErrorState = typeof VideoErrorState[keyof typeof VideoErrorState];

/**
 * 비디오 커스텀 플레이어의 재생 상태 타입
 */
export const VideoPlayState = {
  CAN_PLAY: 'canPlay',
  PLAYING: 'playing',
  PAUSE: 'pause',
  ENDED: 'ended',
  ERROR: 'error',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type VideoPlayState = typeof VideoPlayState[keyof typeof VideoPlayState];
