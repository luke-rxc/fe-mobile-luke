import { PrizmPayModel } from '../../models';

declare global {
  interface Window {
    sendPrizmPay?: (pay: PrizmPayModel | null) => void;
  }
}

export async function sendPrizmPay() {
  return new Promise<PrizmPayModel>((resolve, reject) => {
    if (window.sendPrizmPay) {
      window.sendPrizmPay(null);
      delete window.sendPrizmPay;
    }

    window.sendPrizmPay = (pay: PrizmPayModel | null) => {
      delete window.sendPrizmPay;

      if (!pay) {
        reject();
      } else {
        resolve(pay);
      }
    };
  });
}
