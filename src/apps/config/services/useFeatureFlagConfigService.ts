import { FeatureFlagsFlagType } from '@contexts/FeatureFlagsContext';
import { useFeatureFlags } from '@hooks/useFeatureFlags';
import { useToast } from '@hooks/useToast';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const useFeatureFlagConfigService = () => {
  const formMethod = useForm();
  const { reset, handleSubmit: onSubmit } = formMethod;
  const { getFeatureFlagList, setFeatureFlagList } = useFeatureFlags();
  const featureFlagList = getFeatureFlagList();
  const { addToast } = useToast();

  useEffect(() => {
    if (!featureFlagList || featureFlagList.length === 0) {
      return;
    }

    const values = featureFlagList.reduce((target, item) => {
      return { ...target, [item.type]: item.flag };
    }, {});

    reset(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureFlagList]);

  const handleSubmit = onSubmit((values) => {
    setFeatureFlagList(
      featureFlagList.map((item) => {
        if (Object.keys(values).includes(item.type) && item.flagType !== FeatureFlagsFlagType.NORMAL) {
          return {
            ...item,
            flag: values[item.type],
          };
        }
        return item;
      }),
    );
    addToast({
      autoDismiss: 5000,
      direction: 'bottom',
      message: 'Feature Flag가 변경되었습니다.',
    });
  });

  const handleReset = () => {
    const values = featureFlagList.reduce((target, item) => {
      return { ...target, [item.type]: item.flag };
    }, {});

    reset(values);
  };

  return { formMethod, featureFlagList, handleSubmit, handleReset };
};
