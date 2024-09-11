export interface CheckoutShippingSchema {
  addressName: string;
  address: string;
  addressDetail: string;
  createdDate: string;
  id: number;
  isDefault: boolean;
  name: string;
  phone: string;
  postCode: string;
  updatedDate: string;
}

export interface CheckoutShippingListSchema {
  content: CheckoutShippingSchema[];
}
