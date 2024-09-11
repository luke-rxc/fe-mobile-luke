import { VerticalAlignType } from '../constants';
import type { BackgroundInfoModel, DisplayMediaModel } from './Presets';

/**
 * 헤더 컴포넌트
 * - 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type HeaderDisplayModel = {
  backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
  backgroundMedia: DisplayMediaModel; // 백그라운드 이미지
  footerImage: DisplayMediaModel; // 푸터 이미지
  logoImage: DisplayMediaModel; // 로고 이미지
  mainImage: DisplayMediaModel; // 메인 이미지
  verticalAlign: Omit<VerticalAlignType, 'TOP'>; // 세로 정렬
};

/**
 * 로고 이미지
 */
export type LogoStyledProps = {
  to: { x: number };
  width: number;
};
