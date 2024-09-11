import { useContext } from 'react';
import { CartStockContext } from '../contexts/CartStockContext';

export const useCartStock = () => useContext(CartStockContext);
