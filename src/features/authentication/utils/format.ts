export function toMMSS(timeMS: number) {
  const current = Math.floor(timeMS / 1000);
  const minute = Math.floor((current % 3600) / 60);
  const second = Math.floor((current % 3600) % 60);

  const mm = minute < 10 ? `0${minute}` : `${minute}`;
  const ss = second < 10 ? `0${second}` : `${second}`;

  return [mm, ss].join(':');
}
