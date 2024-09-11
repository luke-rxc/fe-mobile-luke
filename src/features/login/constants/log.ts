export const LogEventTypes = {
  // 회원가입/로그인 페이지 진입 시
  LogViewSignIn: 'sign.view_sign_in',
  // 인증코드 입력 화면 노출 시(이메일)
  LogViewVerificationCode: 'sign.view_verification_code',
  // 회원가입 완료 시
  LogCompleteSignUp: 'sign.complete_sign_up',
  // 로그인 완료 시
  LogCompleteSignIn: 'sign.complete_sign_in',
} as const;

export const LogEventWebBranchTypes = {
  // 회원가입 완료 시
  LogCompleteSignUp: 'COMPLETE_REGISTRATION',
  // 로그인 완료 시
  LogCompleteSignIn: 'LOGIN',
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = typeof LogEventTypes[keyof typeof LogEventTypes];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventWebBranchTypes = typeof LogEventWebBranchTypes[keyof typeof LogEventWebBranchTypes];

export const LogEventWebFacebookTypes = {
  LogCompleteSignUp: 'CompleteRegistration',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventWebFacebookTypes = typeof LogEventWebFacebookTypes[keyof typeof LogEventWebFacebookTypes];
