import { CheckoutPaymentGateWaySchema } from '../schemas';

export function replaceSingleQuote(paymentGatewayParameter: CheckoutPaymentGateWaySchema | null) {
  if (!paymentGatewayParameter) {
    return paymentGatewayParameter;
  }

  return {
    ...paymentGatewayParameter,
    name: paymentGatewayParameter.name.replace(/'/g, '"'),
    naverProducts: (paymentGatewayParameter.naverProducts ?? []).map((product) => {
      return {
        ...product,
        name: product.name.replace(/'/g, '"'),
      };
    }),
  };
}
