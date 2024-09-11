/* @todo 내부 APP Path 등록 */
export const linkURL = (path: string): string =>
  `${typeof window !== 'undefined' ? window.location.origin : 'APP PATH REQUIRED'}${path}`;
