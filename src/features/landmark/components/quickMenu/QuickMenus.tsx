import styled, { useTheme } from 'styled-components';
import isString from 'lodash/isString';
import classnames from 'classnames';
import { useNavigationState } from '../../hooks/useNavigation';
import { QuickMenu, QuickMenuProps } from './QuickMenu';

export type QuickMenusProps = {
  menus?: (QuickMenuProps | QuickMenuProps['type'])[];
  className?: string;
};

/**
 * Header QuickMenus 컴포넌트
 */
export const QuickMenus = styled(({ menus, className }: QuickMenusProps) => {
  const theme = useTheme();
  const { open, status } = useNavigationState();
  const classNames = classnames(className, { 'is-front': status && status !== 'closed' });

  if (!menus) {
    return null;
  }

  return (
    <div className={classNames}>
      {menus.map((menu) => {
        const props = isString(menu) ? { type: menu } : menu;
        return <QuickMenu key={props.type} style={{ color: open ? theme.color.black : 'inherit' }} {...props} />;
      })}
    </div>
  );
})`
  ${({ theme }) => theme.mixin.fixed({ t: 0, r: 0 })};
  ${({ theme }) => theme.mixin.z('header', 1)};
  ${({ theme }) => theme.mixin.centerItem()};
  height: 5.6rem;
  padding: 0 0.8rem;

  &.is-front {
    ${({ theme }) => theme.mixin.z('navigation', 1)};
  }
`;
