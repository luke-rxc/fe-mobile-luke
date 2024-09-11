export type ToRequired<T> = {
  [P in keyof T]-?: T[P];
};

export type PickFunctionProperty<
  T,
  // eslint-disable-next-line @typescript-eslint/ban-types
  O = T extends {} ? ToRequired<T> : Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  F = { [key in keyof O]: O[key] extends Function ? key : '' },
  K = Exclude<F[keyof F], ''>,
> = Pick<T, K extends keyof T ? K : never>;
