import { FormProvider } from 'react-hook-form';
import { LoginContent } from '../components';
import { useLoginModalService } from '../services';
import { PAGE_LOAD_TYPE, SignUser } from '../types';

export interface LoginModalContainerProps {
  onNext: (user: SignUser) => void;
}

export const LoginModalContainer = ({ onNext }: LoginModalContainerProps) => {
  const { pageLoad, banners, handleLogin, onSubmit, method } = useLoginModalService({ onNext });

  if (pageLoad === PAGE_LOAD_TYPE.LOADING) {
    return null;
  }

  return (
    <FormProvider {...method}>
      <LoginContent banners={banners} onSubmit={onSubmit} onSocial={handleLogin} />
    </FormProvider>
  );
};
