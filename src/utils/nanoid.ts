import { v4 as uuidv4 } from 'uuid';

export function nanoid(length = 10): string {
  return uuidv4().substr(0, length);
}

export function uid(): string {
  const head = Date.now().toString(36);
  const tail = Math.random().toString(36).substr(2);
  return `${head}${tail}`;
}
