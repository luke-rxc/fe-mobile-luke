import { getImageLink } from '@utils/link';
import { toKRW } from '@utils/toKRW';
import {
  CartBrandGroupSchema,
  CartBrandSchema,
  CartGoodsDataSchema,
  CartGoodsSchema,
  CartImageSchema,
  CartItemSchema,
  CartProviderSchema,
  CartSchema,
  CartShippingGroupSchema,
} from '../schemas';

export interface CartModel extends CartSchema {
  cartItemList: CartItemModel[];
  orderPriceText: string;
  totalSalesPriceText: string;
  totalShippingCostText: string;
  hasSoldOut: boolean;
  hasGoodsQuantityMoreThanStock: boolean;
}

export interface CartItemModel extends Omit<CartItemSchema, 'shippingGroupList' | 'provider'> {
  shippingGroupList: CartShippingGroupModel[];
  provider: CartProviderModel;
}

export type CartProviderModel = CartProviderSchema;

export interface CartShippingGroupModel
  extends Omit<CartShippingGroupSchema, 'provider' | 'brandGroupList' | 'shippingGroupName' | 'shippingPolicyText'> {
  provider: CartProviderModel;
  brandGroupList: CartBrandGroupModel[];
  shippingGroupName: string;
  totalSalesPriceText: string;
  totalShippingCostText: string;
  shippingPolicyText: string;
}

export interface CartBrandGroupModel extends Omit<CartBrandGroupSchema, 'brand' | 'cartDataList'> {
  brand: CartBrandSchema;
  cartDataList: CartGoodsDataModel[];
}

export interface CartBrandModel extends Omit<CartBrandSchema, 'primaryImage'> {
  primaryImage: CartImageModel;
}

export interface CartGoodsDataModel extends Omit<CartGoodsDataSchema, 'provider' | 'brand' | 'goods'> {
  provider: CartProviderModel;
  brand: CartBrandModel;
  goods: CartGoodsModel;
}

export interface CartGoodsModel extends CartGoodsSchema {
  primaryImage: CartImageModel;
  options: string[];
  goodsPriceText: string;
  salesPriceText: string;
}

type CartImageModel = CartImageSchema;

export function toCartModel(schema: CartSchema): CartModel {
  const cartItemList = schema.cartItemList.map(toCartItemModel);
  const goodsList =
    cartItemList
      .map((cartItem) => cartItem.shippingGroupList)
      .flat()
      .map((shipping) => shipping.brandGroupList)
      .flat()
      .map((brandGroup) => brandGroup.cartDataList)
      .flat() ?? [];
  const buyableGoodsList = goodsList.filter((goods) => goods.isBuyable);
  const buyableItemCount = schema.buyableItemCount ?? buyableGoodsList.length;
  const hasSoldOut = goodsList.some((goods) => !goods.isBuyable);
  const hasGoodsQuantityMoreThanStock = buyableGoodsList.some((goods) => goods.purchasableStock < goods.quantity);
  const {
    totalPrice: { orderPrice, salesPrice, shippingCost },
  } = schema;

  return {
    ...schema,
    cartItemList,
    orderPriceText: toKRW(orderPrice),
    totalSalesPriceText: toKRW(salesPrice),
    totalShippingCostText: toKRW(shippingCost),
    buyableItemCount,
    hasSoldOut,
    hasGoodsQuantityMoreThanStock,
  };
}

function toCartItemModel(schema: CartItemSchema): CartItemModel {
  return {
    ...schema,
    provider: toCartProviderModel(schema.provider),
    shippingGroupList: schema.shippingGroupList.map(toCartShippingGroupModel),
  };
}

function toCartProviderModel(schema: CartProviderSchema): CartProviderModel {
  return {
    ...schema,
  };
}

function toCartShippingGroupModel(schema: CartShippingGroupSchema): CartShippingGroupModel {
  const shippingGroupModel = {
    ...schema,
    provider: toCartProviderModel(schema.provider),
    brandGroupList: schema.brandGroupList.map(toCartBrandGroup),
    shippingGroupName: schema.shippingGroupName ?? `shipping-group-sold-out`,
    shippingPolicyText: schema.shippingPolicyText ?? '',
  };

  const { price, shippingPolicyText } = schema;

  if (!price) {
    return {
      ...shippingGroupModel,
      totalSalesPriceText: '',
      totalShippingCostText: '',
    };
  }

  const { salesPrice, shippingCost } = price;

  return {
    ...shippingGroupModel,
    totalSalesPriceText: toKRW(salesPrice),
    totalShippingCostText: getTotalShippingCostText(shippingCost),
    shippingPolicyText: shippingCost === 0 ? '' : shippingPolicyText ?? '',
  };
}

function getTotalShippingCostText(shippingCost: number) {
  return shippingCost === 0 ? '무료' : toKRW(shippingCost);
}

function toCartBrandGroup(schema: CartBrandGroupSchema): CartBrandGroupModel {
  return {
    ...schema,
    brand: toCartBrandModel(schema.brand),
    cartDataList: schema.cartDataList.map(toCartGoodsDataModel),
  };
}

function toCartBrandModel(schema: CartBrandSchema): CartBrandModel {
  return {
    ...schema,
    primaryImage: toCartImageModel(schema.primaryImage),
  };
}

function toCartGoodsDataModel(schema: CartGoodsDataSchema): CartGoodsDataModel {
  return {
    ...schema,
    provider: toCartProviderModel(schema.provider),
    brand: toCartBrandModel(schema.brand),
    goods: toCartGoodsModel(schema.goods),
  };
}

function toCartGoodsModel(schema: CartGoodsSchema): CartGoodsModel {
  return {
    ...schema,
    options: getOptionValues(schema),
    goodsPriceText: schema.consumerPrice.toLocaleString(),
    salesPriceText: schema.price.toLocaleString(),
    primaryImage: {
      ...schema.primaryImage,
      path: getImageLink(schema.primaryImage.path, 512),
    },
  };
}

function toCartImageModel(schema: CartImageSchema): CartImageModel {
  return {
    ...schema,
  };
}

function getOptionValues(schema: CartGoodsSchema): string[] {
  return schema.option.itemList.map((item) => item.value);
}
