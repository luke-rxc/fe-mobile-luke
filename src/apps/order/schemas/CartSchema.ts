export interface CartSchema {
  buyableItemCount: number;
  cartItemList: CartItemSchema[];
  selectedItemCount?: number;
  totalPrice: CartPriceSchema;
}

export interface CartItemSchema {
  shippingGroupList: CartShippingGroupSchema[];
  provider: CartProviderSchema;
}

export interface CartProviderSchema {
  id: number;
  name: string;
}

export interface CartShippingGroupSchema {
  provider: CartProviderSchema;
  brandGroupList: CartBrandGroupSchema[];
  shippingPolicyText: string | null;
  shippingGroupName: string | null;
  price: CartPriceSchema | null;
}

export interface CartPriceSchema {
  salesPrice: number;
  shippingCost: number;
  orderPrice: number;
}

export interface CartBrandGroupSchema {
  brand: CartBrandSchema;
  cartDataList: CartGoodsDataSchema[];
}

export interface CartBrandSchema {
  id: number;
  name: string;
  primaryImage: CartImageSchema;
  defaultShowRoomId: number | null;
  brandShowRoomCode?: string | null;
}

export interface CartGoodsDataSchema {
  cartId: number;
  provider: CartProviderSchema;
  brand: CartBrandSchema;
  goods: CartGoodsSchema;
  isBuyable: boolean;
  isQuantityChangeable: boolean;
  purchasableStock: number;
  quantity: number;
  consumerPriceWithQuantity: number;
  priceWithQuantity: number;
  shippingGroupName: string | null;
}

export interface CartGoodsSchema {
  id: number;
  code: string;
  name: string;
  label: string | null;
  primaryImage: CartImageSchema;
  consumerPrice: number;
  price: number;
  discountRate: number;
  goodsStatusText: string;
  option: CartGoodsOption;
  packageOption: CartGoodsOption | null;
  showRoomId: number;
}

export interface CartGoodsOption {
  id: number;
  itemList: CartGoodsOptionItem[];
}

export interface CartGoodsOptionItem {
  title: string;
  value: string;
}

export interface CartImageSchema {
  id: number;
  path: string;
  blurHash: string | null;
  width: number;
  height: number;
}
