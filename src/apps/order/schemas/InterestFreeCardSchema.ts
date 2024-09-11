export interface InterestFreeCardSchema {
  cardCode: string;
  cardCompany: string;
  dueDate: number;
  installmentFreeMonthList: number[];
  minimumPaymentAmount: number;
}
