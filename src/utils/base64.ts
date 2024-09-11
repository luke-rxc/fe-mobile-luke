// Reference: https://developer.mozilla.org/ko/docs/Web/API/WindowBase64/Base64_encoding_and_decoding

export function b64Encode(str: string): string {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(__, p1) {
      return String.fromCharCode(`0x${p1 as string}` as unknown as number);
    }),
  );
}

export function b64Decode(str: string): string {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split('')
      .map((c) => {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join(''),
  );
}
