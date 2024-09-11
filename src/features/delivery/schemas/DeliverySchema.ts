export interface DeliverySchema {
  addressName: string;
  address: string;
  addressDetail: string;
  createdDate: number;
  id: number;
  isDefault: boolean;
  name: string;
  phone: string;
  postCode: string;
  updatedDate: number;
}

export interface DeliveryListSchema {
  content: DeliverySchema[];
}
