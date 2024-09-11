import { useMutation } from '@hooks/useMutation';
import { updateProfile } from '../apis';
import { FormFields } from '../models';

export const useProfileService = () => {
  const {
    mutateAsync: handleUpdateProfile,
    isLoading,
    isError,
    error,
  } = useMutation((value: FormFields) => updateProfile(value));

  return {
    handleUpdateProfile,
    isLoading,
    isError,
    error,
  };
};
