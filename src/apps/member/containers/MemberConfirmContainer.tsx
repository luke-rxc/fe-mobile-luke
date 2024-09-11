import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { ConfirmContent } from '@features/login/components';
import { FormProvider } from 'react-hook-form';
import { useMemberConfirmService } from '../services';

export const MemberConfirmContainer = () => {
  const { user, method, onSubmit } = useMemberConfirmService();
  const autoSubmit = user?.method === 'email';
  const isShowAgreement = user?.method === 'apple' && user?.type === 'join';

  useHeaderDispatch({
    type: 'mweb',
    enabled: true,
    quickMenus: ['cart', 'menu'],
  });

  if (!user) {
    return null;
  }

  return (
    <FormProvider {...method}>
      <ConfirmContent user={user} autoSubmit={autoSubmit} isShowAgreement={isShowAgreement} onSubmit={onSubmit} />
    </FormProvider>
  );
};
