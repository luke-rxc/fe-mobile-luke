const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-a11y',
    'storybook-addon-designs',
    'storybook-dark-mode',
  ],
  core: {
    disableTelemetry: true, // storybook 데이터 수집 비활성화
  },
  webpackFinal: async (config) => {
    config.resolve.plugins.push(new TsconfigPathsPlugin({}));

    if (process.env.STORYBOOK_APP_ENV !== 'production') {
      config.module.rules.push({
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: path.resolve(__dirname, '../internals/scripts/plugins/debugReplaceLoader'),
        enforce: 'pre',
      });
    }

    return config;
  },
};
