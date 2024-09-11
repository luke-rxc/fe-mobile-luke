import { getExperiments } from '@utils/abTest';

/**
 * 운영 방식이 정해짐에 따라 관련 로직 변경될 예정
 * 현재는 서버 응답 그대로 반환
 */
export const useABTest = () => {
  return { getExperiments };
};
