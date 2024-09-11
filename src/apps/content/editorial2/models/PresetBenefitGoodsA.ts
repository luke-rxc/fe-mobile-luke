import type { AlignType } from '../constants';
import type {
  BackgroundInfoModel,
  DisplayMediaModel,
  DisplayNavigationOptionModel,
  DisplayTimeOptionModel,
  TypoItemModel,
} from './Presets';

/**
 * 혜택 상품 A 컴포넌트
 * - 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type BenefitGoodsADisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    layoutMarginTop: boolean; // 레이아웃 상단 여백 설정
    layoutMarginBottom: boolean; // 레이아웃 하단 여백 설정
    backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
    backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
    isOverlay: boolean; // 백그라운드 이미지 딤드
    textColor: string; // 텍스트 공통 색상
    align: AlignType; // 가로 정렬
    headerTitle: TypoItemModel; // 헤더 타이틀
    headerSubText: BenefitGoodsASubTextModel[]; // 헤더 서브텍스트 리스트
    headerDetail: TypoItemModel; // 헤더 디테일
    useDetailBox: boolean; // 상세박스 사용
    detailBoxTitle: TypoItemModel; // 박스 타이틀
    detailBoxDescription: TypoItemModel[]; // 디스크립션
  };

/**
 * 헤더 서브 텍스트 정보
 */
export type BenefitGoodsASubTextModel = {
  subTitle: TypoItemModel; // 헤더 서브타이틀
  description: TypoItemModel; // 헤더 디스크립션
};
