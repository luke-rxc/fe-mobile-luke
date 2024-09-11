import { useContext } from 'react';
import { DeviceDetectContext } from '@contexts/DeviceDetectContext';

export const useDeviceDetect = () => useContext(DeviceDetectContext);
