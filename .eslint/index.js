const fs = require('fs');
const path = require('path');

const ruleFiles = fs.readdirSync(__dirname + '/rules').filter((file) => {
  return file !== 'index.js' && !file.endsWith('test.js');
});

const rules = Object.fromEntries(
  ruleFiles.map((file) => {
    return [path.basename(file, '.js'), require('./rules/' + file)];
  }),
);

module.exports = { rules };
