const execSync = require('child_process').execSync;
const inquirer = require('inquirer');
const ip = require('ip');

const question = [
  {
    type: 'list',
    name: 'platform',
    message: '플랫폼을 선택해주세요.',
    choices: ['APP', 'WEB'],
  },
  {
    type: 'list',
    name: 'environment',
    message: '개발환경을 선택해주세요.',
    choices: ['development', 'stage', 'production'],
  },
  {
    type: 'confirm',
    name: 'hostName',
    message: '호스트명을 IP로 사용하시겠습니까?',
    when: (answers) => answers.platform === 'WEB',
  },
  {
    type: 'list',
    name: 'ssl',
    message: 'SSL 인증모드로 사용하시겠습니까?',
    when: (answers) => answers.platform === 'WEB' && !answers.hostName,
    choices: ['N', 'Y'],
  },
];

inquirer.prompt(question).then((answers) => {
  const hostName = answers.hostName ? ip.address() : 'mweb-local.prizm.co.kr';
  const sslCommand =
    answers.ssl === 'Y'
      ? 'HTTPS=true SSL_CRT_FILE=./.cert/prizm-local-cert.pem SSL_KEY_FILE=./.cert/prizm-local-key.pem'
      : '';

  try {
    execSync(
      `${sslCommand} HOST=${hostName} PORT=3000 node ./node_modules/.bin/env-cmd -f environments/.env.${answers.environment} ./node_modules/.bin/craco start`,
      { stdio: 'inherit' },
    );
  } catch (error) {}
});
