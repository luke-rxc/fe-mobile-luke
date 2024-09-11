/**
 * 비동기 함수의 리턴 값
 */
export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

/**
 * 모든 프로퍼티를 필수값으로 변경
 */
export type ToRequired<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * 메소드만 추출
 */
export type PickFunctionProperty<
  T,
  // eslint-disable-next-line @typescript-eslint/ban-types
  O = T extends {} ? ToRequired<T> : Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  F = { [key in keyof O]: O[key] extends Function ? key : '' },
  K = Exclude<F[keyof F], ''>,
> = Pick<T, K extends keyof T ? K : never>;

/**
 * 리스트의 아이템 타입을 추론
 */
export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;
