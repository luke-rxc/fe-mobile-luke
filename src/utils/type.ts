// string
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// string
export function isUndefined(value: unknown): boolean {
  return value === undefined;
}

// Function
export function isFunction(value: unknown): boolean {
  return typeof value === 'function';
}

// object
export function isObject(value: unknown): boolean {
  return typeof value === 'object' && !!value;
}

// LiteralObject, 순수 Object형 체크
export function isLiteralObject(value: Record<string, unknown>): boolean {
  return value && value.constructor && value.constructor.name === 'Object';
}

// boolean
export function isBoolean(value: unknown): boolean {
  return Object.prototype.toString.call(value) === '[object Boolean]';
}
// 정규식
export function isRegExp(value: unknown): boolean {
  return Object.prototype.toString.call(value) === '[object RegExp]';
}

// 비어있는 Object 인지 체크
export function isEmptyObject(value: Record<string, unknown>): boolean {
  return Object.keys(value).length === 0;
}
