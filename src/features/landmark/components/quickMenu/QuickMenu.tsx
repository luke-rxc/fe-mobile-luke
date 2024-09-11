/* eslint-disable react/destructuring-assignment */
import styled from 'styled-components';
import { Action } from '@pui/action';
import { Comment, CommentProps } from './Comment';
import { Menu, MenuProps } from './Menu';
import { Notice, NoticeProps } from './Notice';
import { Cart, CartProps } from './Cart';

export type QuickMenuProps =
  | (CommentProps & { type: 'comment' })
  | (NoticeProps & { type: 'notice' })
  | (CartProps & { type: 'cart'; imagePath?: string })
  | (MenuProps & { type: 'menu' });

/**
 * QuickMenu
 */
export const QuickMenu = styled((props: QuickMenuProps) => {
  // 코멘트
  if (props.type === 'comment') {
    const { type, ...rest } = props;
    return <Comment {...rest} />;
  }

  // 메뉴(햄버거 버튼)
  if (props.type === 'menu') {
    const { type, ...rest } = props;
    return <Menu {...rest} />;
  }

  // 알림
  if (props.type === 'notice') {
    const { type, ...rest } = props;
    return <Notice {...rest} />;
  }

  // 쇼핑백
  if (props.type === 'cart') {
    const { type, ...rest } = props;
    return <Cart {...rest} />;
  }

  return null;
})`
  &${Action}, ${Action} {
    opacity: 1;
    transition: opacity 0.2s;

    &:active {
      opacity: 0.5;
    }
  }
`;
