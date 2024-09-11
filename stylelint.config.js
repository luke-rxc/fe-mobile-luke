const special = require('./.stylelint/orders/special');
const layout = require('./.stylelint/orders/layout');
const boxModel = require('./.stylelint/orders/boxModel');
const visual = require('./.stylelint/orders/visual');
const typography = require('./.stylelint/orders/typography');
const animation = require('./.stylelint/orders/animation');
const misc = require('./.stylelint/orders/misc');

module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-config-styled-components', 'stylelint-config-prettier'],
  plugins: ['stylelint-order'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      customSyntax: '@stylelint/postcss-css-in-js',
    },
  ],
  ignoreFiles: ['**/*', '!src/pui/**/*.ts', '!src/pui/**/*.tsx', 'src/pui/**/*.stories.tsx'],
  defaultSeverity: 'warning',
  rules: {
    'function-no-unknown': null,
    'unit-no-unknown': null,
    'annotation-no-unknown': [
      true,
      {
        ignoreAnnotations: ['/[A-Z]/', '/a-z/'],
      },
    ],
    'at-rule-empty-line-before': ['always'],
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-order': [
      ['Special', special],
      ['Layout', layout],
      ['BoxModel', boxModel],
      ['Visual', visual],
      ['Typography', typography],
      ['Animation', animation],
      ['Misc', misc],
    ].map(([groupName, properties]) => ({
      emptyLineBefore: 'never',
      properties,
      groupName,
    })),
  },
};
