export const validity = <T, V>(
  request: (params: T) => Promise<V>,
  params: T,
  validator?: (params: T) => string,
): Promise<V> => {
  const message = validator?.(params);

  if (message) {
    const err = { data: { message } };
    return Promise.reject(err);
  }

  return request(params);
};
