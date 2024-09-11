/**
 * text 분리
 * (줄바꿈, 링크)
 *
 * @param originText
 * @return Array<string>
 */
export const getSplitText = (originText: string) => {
  const urlRegExp = /(https?:\/\/[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9]{1,6}\b[-a-zA-Z0-9@:%_\\+.~#?&//=]*)/g;
  const newLineRegExp = /(\n)/g;

  return originText
    .trim()
    .split(urlRegExp)
    .map((text) => {
      if (!text) {
        return '';
      }

      if (newLineRegExp.test(text)) {
        const split = text.split(newLineRegExp);
        if (typeof split.flat === 'function') {
          return split.flat();
        }
        return text;
      }
      return text;
    })
    .flat()
    .filter((text) => !!text);
};

/**
 * text 분리
 * (줄바꿈, 링크)
 *
 * @param Array<string> splitText
 * @return boolean
 */
export const getIsExistNewLine = (splitText: Array<string>) => {
  const newLineRegExp = /(\n)/g;
  return splitText.filter((text) => newLineRegExp.test(text)).length > 0;
};
