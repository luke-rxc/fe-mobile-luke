import { VerticalAlignType } from '../constants';
import type { BackgroundInfoModel, ComponentRefModel, ContentInfoModel, DisplayMediaModel } from './Presets';

/**
 * header 컴포넌트 타입
 */
export type HeaderProps = HeaderDisplayModel & {
  contentInfo: ContentInfoModel;
  /** 컴포넌트 노출 여부 */
  visible: boolean;
};

export type HeaderDisplayModel = {
  backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
  backgroundMedia: DisplayMediaModel; // 백그라운드 이미지
  footerImage: DisplayMediaModel; // 푸터 이미지
  logoImage: DisplayMediaModel; // 로고 이미지
  mainImage: DisplayMediaModel; // 메인 이미지
  verticalAlign: Omit<VerticalAlignType, 'TOP'>;
};

/**
 * 백그라운드
 */
export type HeaderStyledProps = {
  color: string;
  height: number;
};

/**
 * 로고 이미지
 */
export type LogoStyledProps = {
  to: { x: number };
  width: number;
};

/**
 * 메인 이미지
 */
export type ItemStyledProps = {
  verticalAlign: Omit<VerticalAlignType, 'TOP'>;
};

export type HeaderComponentRefModel = ComponentRefModel;
