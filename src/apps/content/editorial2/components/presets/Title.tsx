import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import nl2br from '@utils/nl2br';
import { AlignType } from '../../constants';
import type { TypoItemModel } from '../../models';
import { AppearTransition } from './AppearTransition';

export type TitleProps = HTMLAttributes<HTMLDivElement> & {
  mainTitle?: Omit<TypoItemModel, 'sizeType'>;
  subTitle?: Omit<TypoItemModel, 'sizeType'>;
  description?: Omit<TypoItemModel, 'sizeType'>;
  align?: AlignType; // 텍스트 정렬
  textEffect: boolean;
};

// 프리셋 내에서 공통 타이틀 컴포넌트
const TitleComponent = forwardRef<HTMLDivElement, TitleProps>(({ className, ...props }, ref) => {
  const { mainTitle, subTitle, description, textEffect } = props;
  return (
    <div className={className} ref={ref}>
      {mainTitle?.text && (
        <div className="title">
          <AppearTransition transition={textEffect}>
            <p>{nl2br(mainTitle.text)}</p>
          </AppearTransition>
        </div>
      )}
      {subTitle?.text && (
        <div className="sub">
          <AppearTransition transition={textEffect}>
            <p>{nl2br(subTitle.text)}</p>
          </AppearTransition>
        </div>
      )}

      {description?.text && (
        <div className="desc">
          <AppearTransition transition={textEffect}>
            <p>{nl2br(description.text)}</p>
          </AppearTransition>
        </div>
      )}
    </div>
  );
});
export const Title = styled(TitleComponent)`
  text-align: ${({ align }) => align};

  .title {
    color: ${({ mainTitle, theme }) => mainTitle?.color || theme.color.text.textPrimary};
    font: ${({ theme }) => theme.content.contentStyle.fontType.headlineB};
    font-weight: ${({ theme, mainTitle }) => (mainTitle?.bold ? theme.fontWeight.bold : theme.fontWeight.regular)};
    word-break: keep-all;
  }

  .sub {
    color: ${({ subTitle, theme }) => subTitle?.color || theme.color.text.textPrimary};
    font: ${({ theme }) => theme.content.contentStyle.fontType.largeB};
    font-weight: ${({ theme, subTitle }) => (subTitle?.bold ? theme.fontWeight.bold : theme.fontWeight.regular)};
    word-break: keep-all;
  }

  .desc {
    color: ${({ description, theme }) => description?.color || theme.color.text.textPrimary};
    font: ${({ theme }) => theme.content.contentStyle.fontType.small};
    font-weight: ${({ theme, description }) => (description?.bold ? theme.fontWeight.bold : theme.fontWeight.regular)};
    word-break: keep-all;
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
