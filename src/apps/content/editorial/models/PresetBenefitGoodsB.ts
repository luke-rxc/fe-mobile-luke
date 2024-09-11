import type { HTMLAttributes } from 'react';
import type { AlignType } from '../constants';
import type {
  BackgroundInfoModel,
  ComponentRefModel,
  ContentInfoModel,
  DisplayMediaModel,
  DisplayNavigationOptionModel,
  DisplayTimeOptionModel,
  TypoItemModel,
} from './Presets';

/**
 * 혜택 상품 B 컴포넌트 타입
 */
export type BenefitGoodsBProps = BenefitGoodsBDisplayModel &
  Omit<HTMLAttributes<HTMLDivElement>, 'title'> &
  HTMLAttributes<HTMLDivElement> & {
    contentInfo: ContentInfoModel;
    /** 미리보기시 기준시간 */
    displayDateTime: string;
    /** 컴포넌트 노출 여부 */
    visible: boolean;
  };

/**
 * 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type BenefitGoodsBDisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    layoutMarginTop: boolean; // 레이아웃 상단 여백 설정
    layoutMarginBottom: boolean; // 레이아웃 하단 여백 설정
    backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
    backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
    isOverlay: boolean; // 백그라운드 이미지 딤드
    textColor: string; // 텍스트 공통 색상
    align: AlignType; // 텍스트 정렬
    labelPrizmOnly: boolean; // 라벨 프리즘 온리
    labelLiveOnly: boolean; // 라벨 라이브 온리
    title: TypoItemModel; //  타이틀
    subTitle: TypoItemModel; // 서브 타이틀
    description: TypoItemModel[]; // 디스크립션
    useGoodsPrice: boolean; // 상품 가격 등록여부
    priceList: BenefitGoodsBPriceTextModel[]; // 가격 텍스트 정보
  };
export type BenefitGoodsBComponentRefModel = ComponentRefModel;

/**
 * 가격 텍스트 정보
 */
export type BenefitGoodsBPriceTextModel = {
  subTitle: TypoItemModel; // 가격 서브타이틀
  description: TypoItemModel; // 가격 디스크립션
  benefit: TypoItemModel; // 가격 혜택
  priceValue: TypoItemModel; // 가격 원가
  priceBenefitValue: TypoItemModel; // 가격 혜택가
};
