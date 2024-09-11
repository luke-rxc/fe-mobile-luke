interface ToOptionParams {
  ea: number;
  options: { title: string; value: string }[];
}

const addDot = (text: string, use = true) => (use ? ` • ${text}` : text);

/**
 * @deprecated
 *   구 1:1 주문문의 옵션 문자열 생성에 사용되었던 부분으로 현재 사용하지 않음
 */
export const toOptionString = ({ options, ea }: ToOptionParams): string => {
  const optionTexts = options.map(({ value }) => value);
  const quantityText = ea ? addDot(`${ea}개`, !!optionTexts.length) : '';

  return optionTexts.join(' / ') + quantityText; // 50ml • 1개
};

export const toOptionList = ({ options, ea }: ToOptionParams): string[] => {
  const optionTexts = options.map(({ value }) => value);
  const quantityText = ea ? `${ea}개` : undefined;

  return quantityText ? [...optionTexts, quantityText] : optionTexts;
};
