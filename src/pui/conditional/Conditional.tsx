import React, { cloneElement } from 'react';

export interface ConditionalProps extends React.HTMLAttributes<HTMLElement> {
  /** 거짓/참 조건 */
  condition: boolean;
  /** 조건이 참일 때 렌더링할 컴포넌트 */
  trueExp: React.ReactElement;
  /** 조건이 거짓일 때 렌더링할 컴포넌트 */
  falseExp?: React.ReactElement;
}

// truthy falsy
/**
 * 조건부 렌더링을 위한 기능 컴포넌트
 *
 * ``` typescript
 * <Conditional condition={boolean} trueExp={<Link {...props} />} falseExp={<div />}>
 *   <childComp {...props1}/>
 *   <childComp2 {...props2}>
 * </Conditional>
 *
 * // if === true
 * <Link {...props}>
 *   <childComp {...props1}/>
 *   <childComp2 {...props2}>
 * </Link>
 *
 * // if === false
 * <div {...props}>
 *   <childComp {...props1}/>
 *   <childComp2 {...props2}>
 * </div>
 * ```
 */
export const Conditional: React.FC<ConditionalProps> = ({ condition, trueExp, falseExp, children, ...props }) => {
  const component = condition ? trueExp : falseExp;

  if (component) {
    return cloneElement(component, props, [component.props?.children, children]);
  }

  return <>{children}</>;
};
