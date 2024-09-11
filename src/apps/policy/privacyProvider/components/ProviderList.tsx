import React from 'react';
import styled from 'styled-components';
import { Divider } from '@pui/divider';
import type { ListModel } from '../models';

interface Props {
  list: ListModel[];
}

export const ProviderList: React.FC<Props> = ({ list = [] }) => {
  if (list.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      {list.map(({ id, name }) => (
        <li key={`${id}`}>
          <span>{name}</span>
          <Divider b="0.1rem" l="0" r="0" is="div" />
        </li>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.ul`
  & li {
    & > span {
      display: inline-block;
      font: ${({ theme }) => theme.fontType.small};
      color: ${({ theme }) => theme.color.text.textPrimary};
      padding: 0.8rem 0;
    }

    &:last-child {
      & ${Divider} {
        visibility: hidden;
      }
    }
  }
`;
