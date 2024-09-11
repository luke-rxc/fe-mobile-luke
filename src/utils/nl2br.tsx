import React from 'react';

/**
 * 문자열 내 개행문자 react element <br> 태그로 치환하여 리턴
 * @param text
 * @returns
 */
const nl2br = (text: string) => {
  return text.split(/(?:\r\n|\r|\n)/).map((line: string, idx: number, arr: string[]) => {
    return (
      // eslint-disable-next-line react/no-array-index-key
      <React.Fragment key={`${line}-${idx}`}>
        {line}
        {idx < arr.length - 1 && <br />}
      </React.Fragment>
    );
  });
};
export default nl2br;
