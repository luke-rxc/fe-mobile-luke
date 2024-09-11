import { MP_DISTINCT_ID, MP_EXPERIMENT, MP_IDENTIFICATION_FLAG } from '@constants/abTest';
import { GrowthABModel } from '@models/GrowthABModel';
import isArray from 'lodash/isArray';
import { GrowthABSchema } from '@schemas/growthABSchema';
import { getLocalStorage, setLocalStorage } from './storage';
import { userAgent } from './ua';
import { mixPanel } from './log';

const { isApp } = userAgent();

export const getDistinctId = () => {
  return isApp ? getLocalStorage(MP_DISTINCT_ID) ?? '' : mixPanel.getDistinctId();
};

export const setLocalExperiments = (experiments: GrowthABSchema[]) => {
  setLocalStorage(MP_EXPERIMENT, JSON.stringify(experiments));
};

export const getExperiments = (): GrowthABModel[] => {
  try {
    const data = JSON.parse(getLocalStorage(MP_EXPERIMENT) ?? '');

    if (!isArray(data)) {
      return [];
    }

    return data;
  } catch (e) {
    return [];
  }
};

export const getIdentificationFlag = () => {
  if (isApp) {
    return getLocalStorage(MP_IDENTIFICATION_FLAG) === '1';
  }

  const experiments = getExperiments();
  return experiments.length > 0;
};
