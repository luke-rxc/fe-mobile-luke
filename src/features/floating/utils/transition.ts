import { userAgent } from '@utils/ua';

/**
 * FloatingRoot, FloatingItem의 show/hide모션에 적용할 transition value
 */
export const getFloatingTransitionValue = (properties: string[]) => {
  const { isIOS } = userAgent();

  const transition = {
    show: `${isIOS ? '500ms' : '450ms'} cubic-bezier(.65, 0, .35, 1)`,
    hide: '400ms cubic-bezier(.65, 0, .35, 1)',
  };

  return {
    show: properties.map((property) => `${property} ${transition.show}`).join(', '),
    hide: properties.map((property) => `${property} ${transition.hide}`).join(', '),
  };
};

/**
 * app bottomBar의 사이즈 변경시 FloatingRoot의 위치 변경을 위한 transition value
 */
export const getSyncBottomTransitionValue = (properties: string[]) => {
  const { isIOS } = userAgent();

  const transition = isIOS
    ? {
        show: '300ms cubic-bezier(.34,1,.68,1)',
        hide: '300ms cubic-bezier(.34,1,.68,1)',
      }
    : {
        show: '225ms cubic-bezier(.55,.06,.68,.19)',
        hide: '175ms cubic-bezier(.55,.06,.68,.19)',
      };

  return {
    show: properties.map((property) => `${property} ${transition.show}`).join(', '),
    hide: properties.map((property) => `${property} ${transition.hide}`).join(', '),
  };
};
