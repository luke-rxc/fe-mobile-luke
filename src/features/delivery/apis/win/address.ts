import { DeliveryAddressModel } from '@features/delivery/models';

declare global {
  interface Window {
    sendAddress?: (address: DeliveryAddressModel | null) => void;
  }
}

export async function sendAddress() {
  return new Promise<DeliveryAddressModel>((resolve, reject) => {
    if (window.sendAddress) {
      window.sendAddress(null);
      delete window.sendAddress;
    }

    window.sendAddress = (address: DeliveryAddressModel | null) => {
      delete window.sendAddress;

      if (!address) {
        reject();
      } else {
        resolve(address);
      }
    };
  });
}
