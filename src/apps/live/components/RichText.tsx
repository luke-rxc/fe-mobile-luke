import { Action } from '@pui/action';
import styled from 'styled-components';
import React from 'react';
import { userAgent } from '@utils/ua';
import { getAppLink } from '@utils/link';
import { AppLinkTypes } from '@constants/link';
import { getSplitText } from '../utils';

interface Props {
  originText: string;
  color?: string | undefined;
}

export const RichText = ({ originText, color }: Props) => {
  const urlRegExp = /(https?:\/\/[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9]{1,6}\b[-a-zA-Z0-9@:%_\\+.~#?&//=]*)/g;
  const httpRegExp = /^(https:\/\/|http:\/\/)/g;

  const splitText: Array<string> = getSplitText(originText);

  if (splitText.length <= 0) {
    return null;
  }

  return (
    <>
      {splitText.map((text, index) => {
        const key = `${text}+${index}`;

        // 링크 요소
        if (urlRegExp.test(text)) {
          const getLink = userAgent().isApp
            ? (url: string) => getAppLink(AppLinkTypes.EXTERNAL_WEB, { landingType: 'modal', url })
            : (url: string) => url;

          return (
            <AnchorStyled $color={color}>
              <Action key={key} is="a" link={getLink(text)} target="_blank" children={text.replace(httpRegExp, '')} />
            </AnchorStyled>
          );
        }

        // 줄바꿈 요소
        if (/\n/g.test(text)) {
          return <br key={key} />;
        }

        // 택스트
        return <React.Fragment key={key}>{text}</React.Fragment>;
      })}
    </>
  );
};

/** 밑줄 표시된 링크 */
const AnchorStyled = styled(Action)<{ $color: string | undefined }>`
  color: ${({ $color, theme }) => $color || theme.light.color.black};

  a {
    text-decoration: underline;
  }
`;
