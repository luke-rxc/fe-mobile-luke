import { TRANSITION_STOP_TIME } from '../constants';

/**
 * 트랜지션 정지 시간 체크
 */
export const isTransitionStopTime = (expiredDate: number) => {
  return expiredDate - Date.now() < TRANSITION_STOP_TIME;
};
