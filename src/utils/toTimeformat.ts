export function toTimeformat(timeMS: number) {
  const current = Math.floor(Math.max(0, timeMS / 1000));
  const hours = Math.floor(current / (60 * 60));
  const minutes = Math.floor((current % 3600) / 60);
  const seconds = Math.floor((current % 3600) % 60);

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}

export function toMMSS(timeMS: number) {
  const { minutes, seconds } = toTimeformat(timeMS);

  return [minutes, seconds].join(':');
}

export function toHHMMSS(timeMS: number) {
  const { hours, minutes, seconds } = toTimeformat(timeMS);

  return [hours, minutes, seconds].join(':');
}
