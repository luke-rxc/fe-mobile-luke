module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'prettier',
    'plugin:react/recommended', // eslint-plugin-react에서 추천하는 리액트 린팅 설정
    'plugin:@typescript-eslint/recommended', // @typescript-eslint/recommended의 추천 룰 사용
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier', 'react', 'react-hooks', '@typescript-eslint', 'custom-rules'], // 해당 플러그인을 사용할것이라고 등록
  env: {
    // 프로젝트 사용 환경
    browser: true,
    es6: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser', // eslint가 TypeScript를 린팅할 수 있도록 parser 지정
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // jsx 활성화
      ecmaVersion: 2021, // ECMAScript syntax 버젼
      sourceType: 'module', // import 사용
    },
    project: './tsconfig.json',
  },
  rules: {
    'no-alert': 'off', // alert 자주 사용하므로 비활성화
    'react-hooks/exhaustive-deps': 'warn', // dependency 관련 에러는 경고(노란줄)로 바꿈
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }], // js도 확장자 가능하게끔 설정
    'prettier/prettier': 'error', // eslint-plugin-prettier의 룰을 활성화
    'arrow-body-style': 'off', // eslint-plugin-prettier와 충돌하는 ESLint 코어 룰을 비활성화
    'prefer-arrow-callback': 'off', // eslint-plugin-prettier와 충돌하는 ESLint 코어 룰을 비활성화
    'import/no-unresolved': 'off', // src 폴더 밑에 있는 이미지 file을 임포트하는 과정에서 에러로 표기되는 이슈 방지
    'jsx-a11y/anchor-is-valid': 'warn', // a tag에 href 사용하도록 경고하는 룰
    'jsx-a11y/click-events-have-key-events': 'off', // 마우스가 아닌 키보드로 컴퓨터를 이용하는 사람들을 위한 접근성 옵션 꺼둠. 추후 적용하고자 하면 제거할 것
    'jsx-a11y/no-static-element-interactions': 'off', // semantic 의미를 갖고 있지 않은 태그 사용을 지양하도록 하는 옵션 꺼둠
    'jsx-a11y/label-has-associated-control': 'off', // 라벨태그 내 폼 요소가 반드시 중첩되지는 않도록 옵션 꺼둠
    'react/jsx-props-no-spreading': 'off', // jsx에 넘겨주는 props 에 spread 연산자를 사용할 수 있게끔 셋팅
    'react/no-children-prop': 'off', // children 으로 Prop 넘겨줄 수 있도록 설정
    'import/prefer-default-export': 'off', // export 하는 모듈이 하나일 경우 default로 export 해야하는 옵션
    'react/prop-types': 'off', // prop-type 체크 비활성화
    'react/require-default-props': 'off', // 기본 props require 정의
    'react/react-in-jsx-scope': 'off', // jsx, tsx를 사용하여도 React를 꼭 import 하지 않아도 됨.
    '@typescript-eslint/no-use-before-define': 'off', // 정의되기 전 사용하는 경우 lint 처리
    '@typescript-eslint/explicit-module-boundary-types': 'off', //리턴 type을 명시적으로 설정하는 룰을 비활성화,
    'react/prop-types': 0, // typescript를 사용하기 때문에 react props type체크 린트 off
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.stories.tsx', '**/*.test.ts', '**/*.test.tsx'],
      },
    ], // storybook구성시 devDependency 사용을 허용
    'react/display-name': 'off', // display name 설정 비활성화
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true, // 조건부 함수 실행 허용
      },
    ],
    'custom-rules/import-react-router-dom': 'warn',
  },
};
