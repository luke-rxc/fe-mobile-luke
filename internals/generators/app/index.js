'use strict';

const { join } = require('path');

module.exports = {
  description: 'Add configuration for app',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      validate: (value) => /.+/.test(value) || 'name is required',
    },
    {
      type: 'directory',
      name: 'path',
      message: 'Where would you like to put this app?',
      basePath: './src/apps',
    },
    {
      type: 'checkbox',
      name: 'technical',
      message: 'What configuration do you need?',
      pageSize: 12,
      choices: [
        { name: 'mocks', value: '__mocks__/**/**.hbs', checked: true },
        { name: 'apis', value: 'apis/**/**.hbs', checked: true },
        { name: 'components', value: 'components/**/**.hbs', checked: true },
        { name: 'constants', value: 'constants/**/**.hbs', checked: true },
        { name: 'containers', value: 'containers/**/**.hbs', checked: true },
        { name: 'hooks', value: 'hooks/**/**.hbs', checked: true },
        { name: 'models', value: 'models/**/**.hbs', checked: true },
        { name: 'schemas', value: 'schemas/**/**.hbs', checked: true },
        { name: 'pages', value: 'pages/**/**.hbs', checked: true },
        { name: 'services', value: 'services/**/**.hbs', checked: true },
        { name: 'utils', value: 'utils/**/**.hbs', checked: true },
        { name: 'routes', value: 'routes.ts.hbs', checked: true },
      ],
    },
  ],
  actions: ({ path, technical }) => {
    const actions = [];

    actions.push('Start configuring apps...');

    technical.forEach((files) => {
      actions.push({
        type: 'addMany',
        destination: `${join('./src/apps', path)}/{{ camelCase name }}`,
        base: './internals/generators/app',
        templateFiles: `./internals/generators/app/${files}`,
        abortOnFail: true,
      });
    });

    return actions;
  },
};
