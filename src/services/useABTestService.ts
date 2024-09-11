import { getGrowthAB } from '@apis/growthAB';
import { WebLogTypes } from '@constants/log';
import { GrowthABSchema } from '@schemas/growthABSchema';
import { setLocalExperiments } from '@utils/abTest';
import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { getDistinctId } from '@utils/log/mixPanel';

const debug = createDebug('services:useABTestService');

export const useABTestService = () => {
  /**
   * 실험 정보 믹스패널 로깅
   */
  const logExperiments = (experiments: GrowthABSchema[]) => {
    experiments.forEach((experiment) => {
      const { name, group } = experiment;
      tracking.logEvent({
        name: '$experiment_started',
        parameters: { 'Experiment name': name, 'Variant name': group },
        targets: {
          web: [WebLogTypes.MixPanel],
        },
      });
    });
  };

  const setABTest = async () => {
    try {
      const id = getDistinctId();

      if (!id) {
        return;
      }

      const experiments = await getGrowthAB();
      setLocalExperiments(experiments);
      logExperiments(experiments);
    } catch (e) {
      debug.error(e);
      setLocalExperiments([]);
    }
  };

  return {
    setABTest,
  };
};
