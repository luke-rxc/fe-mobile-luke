/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useMemo } from 'react';
import styled from 'styled-components';
import { getAppLink } from '@utils/link';
import { AppLinkTypes } from '@constants/link';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Action } from '@pui/action';

/** URL 정규표현식 */
// eslint-disable-next-line no-useless-escape
const urlRegExp = /(https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9]{1,6}\b[-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
/** 프로토콜 정규표현식 */
const httpRegExp = /^(https:\/\/|http:\/\/)/g;
/** 줄바꿈 정규표현식 */
const newLineRegExp = /(\n)/g;

export interface RichTextProps extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'children'> {
  /** Rich 텍스트가 포함된 문자열 */
  text: string;
  /** Rich 텍스트중 URL 요소를 클릭할때 실행할 이벤트 콜백 */
  onClickLink?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, url: string) => void;
}

/**
 * RichText 컴포넌트
 */
export const RichText = styled(
  forwardRef<HTMLParagraphElement, RichTextProps>(({ text, onClickLink, ...props }, ref) => {
    const { isApp } = useDeviceDetect();

    /**
     * url convert
     */
    const getLink = isApp
      ? (url: string) => getAppLink(AppLinkTypes.EXTERNAL_WEB, { landingType: 'modal', url })
      : (url: string) => url;

    /**
     * 링크요소를 클릭할때 실행할 이벤트핸들러
     */
    const handleClickLink = (url: string) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      onClickLink?.(e, url);
    };

    /**
     * content
     */
    const RichTextContent = useMemo(() => {
      const splitText = text
        .trim()
        .split(urlRegExp)
        .map((str) => (newLineRegExp.test(str) ? str.split(newLineRegExp).flat() : str))
        .flat();

      return splitText.map((str, index) => {
        const key = `${str}+${index}`;

        // 링크 요소
        if (urlRegExp.test(str)) {
          return (
            <Action
              is="a"
              target="_blank"
              key={key}
              link={getLink(str)}
              onClick={handleClickLink(str)}
              children={str.replace(httpRegExp, '')}
            />
          );
        }

        // 줄바꿈 요소
        if (newLineRegExp.test(str)) {
          return <br key={key} />;
        }

        // 택스트
        return <React.Fragment key={key}>{str}</React.Fragment>;
      });
    }, [text, onClickLink]);

    return (
      <p ref={ref} {...props}>
        {RichTextContent}
      </p>
    );
  }),
)``;
