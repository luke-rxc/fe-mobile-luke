import {
  OptionDefaultSchema,
  OptionSchema,
  OptionItemSchema,
  OptionInfoSchema,
  GoodsSchema,
  OrderSaveSchema,
  OptionMetadataSchema,
  OptionComponentsSchema,
} from '../schemas';
import { GoodsModel, BrandModel } from './GoodsModel';

// 전체 Option Model
export type OptionModel = OptionSchema & OptionMetadataSchema;

// Option > Item Model
export type OptionItemModel = OptionItemSchema;

// Option > Item > Option Model
export type OptionInfoModel = OptionInfoSchema;

//
export type OrderSaveModel = OrderSaveSchema;

// Webview 내 Brand Model
interface BrandUiModel extends Omit<BrandModel, 'primaryImageOriginal' | 'showRoom'> {
  defaultShowroomId: number;
}

export interface OptionComponentModel {
  type: OptionComponentsSchema;
  title: string;
}

// Option Info : Webview 에 보내주는 부분 포함
interface OptionCommonModel extends Pick<GoodsSchema, 'isCartAddable' | 'primaryImage'>, OptionDefaultSchema {
  itemList: OptionSchema['itemList'];
  goodsId: GoodsSchema['id'];
  goodsName: GoodsSchema['name'];
  isRunOut: GoodsSchema['isRunOut'];
  showRoomId: number;
  userMaxPurchaseEa: GoodsSchema['userMaxPurchaseEa'];
  isAllPriceSame: OptionMetadataSchema['isAllPriceSame'];
  components: OptionComponentModel[];
  multiChoicePolicy: OptionMetadataSchema['multiChoicePolicy'];
  guideMessages: OptionMetadataSchema['guideMessages'];
}

export interface OptionUiModel extends OptionCommonModel {
  brandInfo: BrandUiModel | null;
}

const toGoodsOptionCommonModel = (detailGoods: GoodsModel, reqShowRoomId: number): OptionCommonModel => {
  const { primaryImage, isCartAddable, option, optionMetadata, id, name, userMaxPurchaseEa, isRunOut } = detailGoods;
  const { titleList, itemList, defaultOption } = option;
  const { consumerPrice, price, purchasableStock, discountRate } = defaultOption;
  const { isAllPriceSame, components: optionComponents, multiChoicePolicy, guideMessages } = optionMetadata;

  /** 좌석지정 진행시 metaData 값 추가될 수 있음 */
  const components: OptionComponentModel[] = optionComponents.map((value, index) => {
    return {
      type: value,
      title: titleList[index],
    };
  });

  return {
    primaryImage,
    isCartAddable,
    goodsId: id,
    goodsName: name,
    showRoomId: reqShowRoomId,
    itemList,
    userMaxPurchaseEa,
    consumerPrice,
    price,
    purchasableStock,
    discountRate,
    isRunOut,
    isAllPriceSame,
    components,
    multiChoicePolicy,
    guideMessages,
  };
};

/**
 * Webview (1.3.0 Higher) + Mweb Option Model
 */
export const toGoodsOptionModel = (detailGoods: GoodsModel, reqShowRoomId: number): OptionUiModel => {
  const webviewOptionCommon = toGoodsOptionCommonModel(detailGoods, reqShowRoomId);
  const { brand } = detailGoods;

  return {
    ...webviewOptionCommon,
    brandInfo: brand
      ? {
          id: brand.id,
          name: brand.name,
          primaryImage: brand.primaryImage,
          defaultShowroomId: brand.showRoom.id,
        }
      : null,
  };
};

/**
 * 최종 옵션 Select Model
 * - 장바구니, 구매하기 로깅 모델 연계
 */
export interface OptionSelectedModel {
  /** 해당 옵션 id */
  id: number[];
  /** 해당 옵션의 상품 가격 */
  price: number[];
  /** 할인율 */
  discountRate: number[];
  /** 옵션 수량 */
  quantity: number[];
}
