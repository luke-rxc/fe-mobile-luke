export const PHONE_PATTERN_REX = /(^01[0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/g;

export function phoneNumberToString(phone: string): string {
  const str = phone.replace(/[-]/g, '');
  return str.replace(PHONE_PATTERN_REX, '$1-$2-$3');
}
