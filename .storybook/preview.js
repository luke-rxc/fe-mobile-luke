import { BrowserRouter } from 'react-router-dom';
import { useDarkMode } from 'storybook-dark-mode';
import { Toaster } from 'react-hot-toast';
import { Menu } from '../src/stories/menu';
import theme from '../src/styles/theme';
import darkTheme from '../src/styles/darkTheme';
import { GlobalStyle } from '../src/styles/global';
import styled, { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import { addDecorator } from '@storybook/react';
import { initializeWorker, mswDecorator } from 'msw-storybook-addon';
import { DocsContainer } from './DocsContainer';

initializeWorker();
addDecorator(mswDecorator);

/**
 *
 * @returns [메뉴1, [메뉴1-하위메뉴], 메뉴2, [메뉴2-하위메뉴]]
 * @example ['Foundation', ['Color'], 'Components'];
 */
const getSortedMenu = () => {
  let menu = [];
  for (let key in Menu) {
    const main = key;
    const sub = Object.keys(Menu[key]);
    menu.push(main, sub);
  }
  return menu;
};

/**
 * Global argTypes 세팅
 */
export const argTypes = {
  // as, theme, forwardedAs 불필요한 argTypes 미노출 처리
  as: { table: { disable: true } },
  theme: { table: { disable: true } },
  forwardedAs: { table: { disable: true } },
};

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    storySort: {
      order: getSortedMenu(),
      method: 'alphabetical',
    },
  },
  a11y: {
    config: {
      /**
       * https://github.com/dequelabs/axe-core/blob/HEAD/doc/rule-descriptions.md
       */
      rules: [
        { id: 'label', enabled: false },
        { id: 'color-contrast', enabled: false },
      ],
    },
  },
  msw: [],
  docs: {
    container: DocsContainer,
  },
  controls: {
    matchers: {
      color: /color/i,
    },
  },
};

const client = new QueryClient();

/**
 * @see {@link https://storybook.js.org/docs/react/writing-stories/decorators}
 */
export const decorators = [
  (Story) => {
    return (
      <BrowserRouter>
        <QueryClientProvider client={client}>
          <ThemeProvider theme={useDarkMode() ? darkTheme : theme}>
            <GlobalStyle />
            <Wrapper>
              <Story />
              <Toaster position="top-right" />
            </Wrapper>
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    );
  },
];

const Wrapper = styled.div`
  font-size: ${({ theme }) => theme.fontSize.s15};
`;
