export const priceConvertUnit = (price: number) => {
  const priceUnit = price >= 10000 ? 10000 : 1000;

  return {
    price: Math.floor(price / priceUnit),
    unit: priceUnit === 10000 ? '만' : '천',
  };
};
