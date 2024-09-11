'use strict';

const inquirerDirectory = require('inquirer-directory');

const appGenerator = require('./app');

module.exports = (plop) => {
  plop.addPrompt('directory', inquirerDirectory);

  // feature generator
  plop.setGenerator('app', appGenerator);
};
