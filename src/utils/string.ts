// 3자리 수마다 . 을 찍어줌
export function formatToAmount(value: number): string {
  return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

// \r, \n, \r\n, \n\r 등을 br 태그로 치환
export function rn2br(value: string): string {
  return value.replace(/(\r\n|\n\r|\n|\r)/gm, '<br/>');
}

// 10 미만은 앞에 0을 붙이고 10 이상은 그대로 리턴
export function digit(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}
