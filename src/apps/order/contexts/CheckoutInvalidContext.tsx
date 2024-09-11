import { createContext, useCallback, useState } from 'react';

interface Props {
  children: JSX.Element[] | JSX.Element;
  initialValid?: boolean[];
}

interface CheckoutInvalidContextProps {
  isAuthValid: boolean;
  isDeliveryValid: boolean;
  isPayValid: boolean;
  updateIsAuthValid: (isValid: boolean) => void;
  updateIsDeliveryValid: (isValid: boolean) => void;
  updateIsPayValid: (isValid: boolean) => void;
}

const initial = {
  isAuthValid: false,
  isDeliveryValid: false,
  isPayValid: false,
  updateIsAuthValid: () => {},
  updateIsDeliveryValid: () => {},
  updateIsPayValid: () => {},
};
export const CheckoutInvalidContext = createContext<CheckoutInvalidContextProps>(initial);
export const CheckoutInvalidProvider = ({ children, initialValid = [false, false, false] }: Props) => {
  const [isAuthValidProps, isDeliveryValidProps, isPayValidProps] = initialValid;
  const [isAuthValid, setIsAuthValid] = useState(isAuthValidProps);
  const [isDeliveryValid, setIsDeliveryValid] = useState(isDeliveryValidProps);
  const [isPayValid, setIsPayValid] = useState(isPayValidProps);

  const updateIsAuthValid = useCallback((isValid: boolean) => {
    setIsAuthValid(isValid);
  }, []);
  const updateIsDeliveryValid = useCallback((isValid: boolean) => {
    setIsDeliveryValid(isValid);
  }, []);
  const updateIsPayValid = useCallback((isValid: boolean) => {
    setIsPayValid(isValid);
  }, []);

  return (
    <CheckoutInvalidContext.Provider
      value={{ isAuthValid, isDeliveryValid, isPayValid, updateIsAuthValid, updateIsDeliveryValid, updateIsPayValid }}
    >
      {children}
    </CheckoutInvalidContext.Provider>
  );
};
