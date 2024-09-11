import { FormProvider } from 'react-hook-form';
import { ConfirmContent } from '../components';
import { useConfirmModalService } from '../services';
import { SignUser } from '../types';

export interface LoginConfirmModalContainerProps {
  user: SignUser;
  onPrev: () => void;
}

export const LoginConfirmModalContainer = ({ user, onPrev }: LoginConfirmModalContainerProps) => {
  const { formMethod, handleSubmit } = useConfirmModalService(user, onPrev);
  const { method, type } = user;
  const autoSubmit = method === 'email' && type === 'login';
  const isShowAgreement = (method === 'apple' && type === 'join') || (method === 'email' && type === 'join');

  return (
    <FormProvider {...formMethod}>
      <ConfirmContent user={user} autoSubmit={autoSubmit} isShowAgreement={isShowAgreement} onSubmit={handleSubmit} />
    </FormProvider>
  );
};
