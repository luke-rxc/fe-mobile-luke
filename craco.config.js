const { whenProd } = require('@craco/craco');
const CracoAlias = require('craco-alias');
const { format } = require('date-fns');
const git = require('git-rev-sync');
const { DefinePlugin } = require('webpack');
const StylelintPlugin = require('stylelint-webpack-plugin');
const DebugReplace = require('./internals/scripts/plugins/debugReplace');
const v8 = require('v8');

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: '.',
        tsConfigPath: 'tsconfig.paths.json',
        debug: false,
      },
    },
    {
      plugin: DebugReplace,
    },
  ],
  babel: {
    plugins: [['babel-plugin-styled-components', { displayName: true }]],
  },
  webpack: {
    configure: (webpackConfig) => {
      whenProd(() => {
        console.log();
        console.log('Build Information:');
        console.log(`  REACT_APP_ENV: ${process.env.REACT_APP_ENV}`);
        console.log(`  v8 Heap Statistics: ${v8.getHeapStatistics().heap_size_limit / (1024 * 1024)} MB`);
        console.log();

        if (process.env.REACT_APP_ENV !== 'development') {
          // Datadog Sourcemap 매핑을 위해 주석 처리, aws 배포시 map 파일 관리
          // webpackConfig.devtool = false;
        }
      });

      webpackConfig.plugins.push(
        new DefinePlugin({
          // Datadog Version에 사용될 환경 변수 정의
          'process.env.REACT_APP_RELEASE_VERSION': JSON.stringify(getReleaseVersion()),
        }),

        // 'local', 'development' 환경에서만 stylelint 작동
        ...(process.env.REACT_APP_ENV === 'development' ? [new StylelintPlugin({ extensions: ['ts', 'tsx'] })] : []),
      );

      return webpackConfig;
    },
  },
  jest: {
    configure: (jestConfig) => {
      return {
        ...jestConfig,
        collectCoverageFrom: ['**/src/utils/**/!(index)*.{ts,tsx}'],
        coveragePathIgnorePatterns: ['/api/', '/log/'],
        testEnvironment: 'jsdom',
        setupFilesAfterEnv: ['<rootDir>/setup.ts'],
      };
    },
  },
};

/**
 * Release Version
 *
 * e.g. 230518-d506697
 */
function getReleaseVersion() {
  const date = format(new Date(), 'yyMMdd');
  const hash = git.short();

  return [date, hash].join('-');
}
