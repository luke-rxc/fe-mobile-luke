export function toNumber(val: string | number) {
  if (typeof val === 'number') {
    return Number(val);
  }

  return Number(val.replace(/[,]/g, ''));
}
