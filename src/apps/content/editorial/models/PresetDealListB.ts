import type { HTMLAttributes } from 'react';
import { GoodsStatusType, GoodsType } from '@constants/goods';
import { GoodsCardProps } from '@pui/goodsCard';
import { AlignType } from '../constants';
import type {
  BackgroundInfoModel,
  ComponentRefModel,
  ContentInfoModel,
  DisplayMediaModel,
  DisplayNavigationOptionModel,
  DisplayTimeOptionModel,
  TextItemModel,
} from './Presets';

/**
 * 상품 컴포넌트 B
 */
export type DealListBProps = DealListBDisplayModel &
  Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
    contentInfo: ContentInfoModel;
    goodsList: DealListBGoodsModel[];
    /** 미리보기시 기준시간 */
    displayDateTime: string;
    /** 컴포넌트 노출 여부 */
    visible: boolean;
  };
export type DealListBDisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    useText: boolean; // 텍스트 사용여부
    align: AlignType; // 가로 정렬
    textEffect: boolean; // 텍스트 모션 효과 사용여부
    title: Omit<TextItemModel, 'sizeType'>; // 타이틀
    subTitle: Omit<TextItemModel, 'sizeType'>; // 서브타이틀
    description: Omit<TextItemModel, 'sizeType'>; // 디스크립션
    backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
    backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보//Omit<BackgroundType, 'VIDEO'>;
    isOverlay: boolean; // 백그라운드 이미지 딤드
    goodsColor: string; // 상품 정보 텍스트 색상
  };

export type DealListBComponentRefModel = ComponentRefModel;
export type DealListBGoodsModel = GoodsCardProps & {
  type: GoodsType;
  status: GoodsStatusType;
};
