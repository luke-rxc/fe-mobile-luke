const path = require('path');
const { loaderByName, getLoader } = require('@craco/craco');

module.exports = {
  overrideWebpackConfig: ({ webpackConfig }) => {
    // 운영 환경에서는 debug 기능이 disabled 처리가 되어있기 때문에 아래 로직을 반영하지 않음
    if (process.env.REACT_APP_ENV !== 'production') {
      const loaderName = loaderByName('babel-loader');

      const babel = getLoader(webpackConfig, loaderName).match.loader;

      babel.use = [
        {
          loader: babel.loader,
          options: babel.options,
        },
        {
          loader: path.resolve(__dirname, 'debugReplaceLoader'),
        },
      ];

      delete babel['loader'];
      delete babel['options'];
    }

    return webpackConfig;
  },
};
