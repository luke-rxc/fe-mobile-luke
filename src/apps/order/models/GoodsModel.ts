export interface GoodsModel {
  id: GoodsId;
  name: string;
  price: number;
  salePrice: number;
  saleRate: number;
  options: { label: string; value: string }[];
  img: {
    url: string;
    width: number;
    height: number;
  };
  quantity: number;
}

export type GoodsId = number;
