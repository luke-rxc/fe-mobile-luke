/**
 * 규칙에 따른 값 검증을 위한 정규표현식
 */
const REGEX = {
  space: /\s/,
  alpha: /^[a-zA-Z]+$/i,
  lowerAlpha: /^[a-z]$/i,
  email: /^[a-z0-9_+.-]+@([a-z0-9-]+\.)+[a-z]{2,4}$/,
  tel: /^(02|031|032|033|041|042|043|044|051|052|0522|053|054|055|061|062|063|064|070)(\d{3,4})(\d{4})$|^1544\d{4}$/,
  cellphone: /(^(010)(\d{4})(\d{4})$)|(^(011|012|015|016|017|018|019)(\d{3})(\d{4})$)/,
  dash: /-/g,
};

// 공백 체크
export function isSpace(value: string): boolean {
  return REGEX.space.test(value);
}

// 알파벳 체크
export function isAlpha(value: string): boolean {
  return REGEX.alpha.test(value);
}

// 알파벳(소문자) 체크
export function isLowerAlpha(value: string): boolean {
  return REGEX.lowerAlpha.test(value);
}

// Email 체크
export function isEmail(value: string): boolean {
  return REGEX.email.test(value);
}

// 휴대폰 검증
export function isCellPhone(value: string) {
  return REGEX.cellphone.test(value.replace(REGEX.dash, ''));
}

// 일반전화번호 검증 (+휴대폰 검증도 옵션여부에 따라 포함)
export function isTel(value: string, isRequiredCellPhone = true) {
  const replaced = value.replace(REGEX.dash, '');
  return isRequiredCellPhone ? REGEX.tel.test(replaced) || isCellPhone(replaced) : REGEX.tel.test(replaced);
}
