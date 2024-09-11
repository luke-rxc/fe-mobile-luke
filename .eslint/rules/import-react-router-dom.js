const fs = require('fs');
const path = require('path');

function findReExports() {
  const filePath = path.resolve('node_modules', '@types', 'react-router-dom', 'index.d.ts');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const reExports = [];
  const regex = new RegExp(/export \{([^}]+)\} from 'react-router'/);
  const match = regex.exec(fileContent);

  if (!match) {
    return reExports;
  }

  const exports = match[1].split(',').map((item) => item.trim());
  reExports.push(...exports);

  return reExports;
}

module.exports = {
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === 'react-router') {
          // react-router 로 부터 받아와서 export 시키는 함수
          const reExports = findReExports();

          for (let i = 0; i < node.specifiers.length; i++) {
            const { imported } = node.specifiers[i];
            if (!reExports.includes(imported.name)) {
              return;
            }

            context.report({
              node,
              message: 'Use react-router-dom instead of react-router',
              fix(fixer) {
                return fixer.replaceTextRange(node.source.range, "'react-router-dom'");
              },
            });
          }
        }
      },
    };
  },
};
