import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

interface Props {
  header: string;
  children?: React.ReactNode;
  disabledHorizontalPadding?: boolean;
  smallVerticalPadding?: boolean;
}

export const GoodsGuide: React.FC<Props> = ({
  header,
  children,
  disabledHorizontalPadding = false,
  smallVerticalPadding = false,
}) => {
  return (
    <Wrapper>
      <p className="header">{header}</p>
      <div
        className={classnames('content', {
          'disabled-horizontal-padding': disabledHorizontalPadding,
          'small-vertical-padding': smallVerticalPadding,
        })}
      >
        {children}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  color: ${({ theme }) => theme.color.text.textPrimary};

  & .header {
    padding: 1.9rem 2.4rem;
    height: 5.6rem;
    font: ${({ theme }) => theme.fontType.mediumB};
  }

  & .content {
    padding: 0 2.4rem 2.4rem;
    white-space: pre-wrap;

    &.disabled-horizontal-padding {
      padding-left: 0;
      padding-right: 0;
    }

    &.small-vertical-padding {
      padding-bottom: 1.2rem;
    }
  }
`;
