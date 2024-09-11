import { createContext, useCallback, useMemo, useState } from 'react';

interface Props {
  children: JSX.Element[] | JSX.Element;
}

interface CartStockContextProps {
  hasMoreThanStock: boolean;
  push: (cartId: number) => void;
  remove: (cartId: number) => void;
}

const initial = { hasMoreThanStock: false, push: () => {}, remove: () => {} };
export const CartStockContext = createContext<CartStockContextProps>(initial);
export const CartStockProvider = ({ children }: Props) => {
  const [cartIds, setCartIds] = useState<number[]>([]);
  const hasMoreThanStock = useMemo(() => {
    return cartIds.length > 0;
  }, [cartIds]);

  const push = useCallback((cartId: number) => {
    setCartIds((prev) => (!prev.includes(cartId) ? prev.concat(cartId) : prev));
  }, []);

  const remove = useCallback((cartId: number) => {
    setCartIds((prev) => (prev.includes(cartId) ? prev.filter((id) => id !== cartId) : prev));
  }, []);

  return <CartStockContext.Provider value={{ hasMoreThanStock, push, remove }}>{children}</CartStockContext.Provider>;
};
