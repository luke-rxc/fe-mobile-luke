export const startInterval = (callback: () => void, seconds: number) => {
  callback();
  return setInterval(callback, seconds * 1000);
};
