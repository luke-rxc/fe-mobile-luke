/**
 * mkcert 인증서 생성
 * @description 선행조건: mkcert package 설치
 * @author jeff@rxc.co.kr
 * @since 20230523
 * @see https://github.com/FiloSottile/mkcert
 */
const execSync = require('child_process').execSync;
const fs = require('fs');

// mkcert Directory
const certDir = './.cert';
// mkcert File Suffix Name
const certSuffixName = 'prizm-local';
// mkcert Allow Domain
const certDomain = ['prizm.co.kr', '*.prizm.co.kr', 'localhost', '127.0.0.1', '::1'];

// cert create generate
const run = () => {
  try {
    execSync('mkcert -install');
    !fs.existsSync(certDir) && fs.mkdirSync(certDir);
    execSync(
      `mkcert -key-file ${certDir}/${certSuffixName}-key.pem -cert-file ${certDir}/${certSuffixName}-cert.pem ${certDomain.join(
        ' ',
      )}`,
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
