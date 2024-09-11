import { WebEventContext } from '@contexts/WebEventContext';
import { useContext } from 'react';

export const useWebEvent = () => useContext(WebEventContext);
