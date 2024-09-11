import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';

export const ContentErrorHeader = () => {
  useHeaderDispatch({
    type: 'brand',
    overlay: true,
    enabled: true,
    title: '',
    quickMenus: ['cart', 'menu'],
  });
  return null;
};
