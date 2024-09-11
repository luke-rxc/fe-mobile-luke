import { createContext } from 'react';
import { userAgent } from '@utils/ua';

interface Props {
  children: JSX.Element[] | JSX.Element;
}

const initialAgentInfo = userAgent();

export const DeviceDetectContext = createContext(initialAgentInfo);
export const DeviceDetectProvider = ({ children }: Props) => {
  return <DeviceDetectContext.Provider value={initialAgentInfo}>{children}</DeviceDetectContext.Provider>;
};
