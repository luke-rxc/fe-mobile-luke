import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Prizm',
    brandUrl: 'https://www.prizm.co.kr',
  }),
});
