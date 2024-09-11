import type { AlignType, DealAColumnType } from '../constants';
import type {
  BackgroundInfoModel,
  DisplayMediaModel,
  DisplayNavigationOptionModel,
  DisplayTimeOptionModel,
  TextItemModel,
} from './Presets';

/**
 * 상품전시 A 컴포넌트
 * - 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type DealListADisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    useText: boolean; // 텍스트 사용여부
    align: AlignType; // 가로 정렬
    textEffect: boolean; // 텍스트 모션 효과 사용여부
    title: Omit<TextItemModel, 'sizeType'>; // 타이틀
    subTitle: Omit<TextItemModel, 'sizeType'>; // 서브타이틀
    description: Omit<TextItemModel, 'sizeType'>; // 디스크립션
    goodsColumnType: DealAColumnType; // 1/2단
    fillColumn: boolean; // 여백여부
    backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
    backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
    isOverlay: boolean; // 백그라운드 이미지 딤드
    goodsColor: string; // 상품 정보 텍스트 색상
  };
