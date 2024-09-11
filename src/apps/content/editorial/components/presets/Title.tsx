import type { VFC } from 'react';
import styled from 'styled-components';
import nl2br from '@utils/nl2br';
import { AlignType, AppearType } from '../../constants';
import type { TextType } from '../../models';
import { AppearBox } from './AppearBox';

export type TitleProps = {
  className?: string;
  title?: TextType;
  subTitle?: TextType;
  description?: TextType;
  align?: AlignType; // 텍스트 정렬
  transform?: AppearType;
};

export type TitleStyledModel = {
  align?: AlignType;
  titleBold?: boolean;
  titleColor?: string;
  subTitleBold?: boolean;
  subTitleColor?: string;
  descBold?: boolean;
  descColor?: string;
};

// 프리셋 내에서 공통 타이틀 컴포넌트
export const Title: VFC<TitleProps> = ({
  className,
  title,
  subTitle,
  description,
  align,
  transform = AppearType.FROM_BOTTOM,
}) => {
  const titleStyledModel: TitleStyledModel = {
    align,
    titleBold: title?.bold,
    titleColor: title?.color,
    subTitleBold: subTitle?.bold,
    subTitleColor: subTitle?.color,
    descBold: description?.bold,
    descColor: description?.color,
  };
  return (
    <TitleStyled className={`${className}`} {...titleStyledModel}>
      {title?.text && (
        <div className="title">
          <AppearBox appear={transform}>
            <p>{nl2br(title.text)}</p>
          </AppearBox>
        </div>
      )}
      {subTitle?.text && (
        <div className="sub">
          <AppearBox appear={transform}>
            <p>{nl2br(subTitle.text)}</p>
          </AppearBox>
        </div>
      )}

      {description?.text && (
        <div className="desc">
          <AppearBox appear={transform}>
            <p>{nl2br(description.text)}</p>
          </AppearBox>
        </div>
      )}
    </TitleStyled>
  );
};

const TitleStyled = styled.div<TitleStyledModel>`
  text-align: ${({ align }) => align};
  .title {
    word-break: keep-all;
    color: ${({ titleColor, theme }) => titleColor || theme.color.text.textPrimary};
    font: ${({ theme }) => theme.content.contentStyle.fontType.headlineB};
    font-weight: ${({ theme, titleBold }) => (titleBold ? theme.fontWeight.bold : theme.fontWeight.regular)};
  }
  .sub {
    word-break: keep-all;
    color: ${({ subTitleColor, theme }) => subTitleColor || theme.color.text.textPrimary};
    font: ${({ theme }) => theme.content.contentStyle.fontType.largeB};
    font-weight: ${({ theme, subTitleBold }) => (subTitleBold ? theme.fontWeight.bold : theme.fontWeight.regular)};
  }
  .desc {
    word-break: keep-all;
    color: ${({ descColor, theme }) => descColor || theme.color.text.textPrimary};
    font: ${({ theme }) => theme.content.contentStyle.fontType.small};
    font-weight: ${({ theme, descBold }) => (descBold ? theme.fontWeight.bold : theme.fontWeight.regular)};
  }
  .title + .sub {
    margin-top: 1.2rem;
  }
  .title + .desc {
    margin-top: 3.2rem;
  }
  .sub + .desc {
    margin-top: 3.2rem;
  }
`;
