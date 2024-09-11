/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { GenerateHapticFeedbackParams, GenerateHapticFeedbackType } from '@constants/webInterface';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';

const isOtherDomain = (url: string) => {
  const urlRegExp =
    /((https?:\/\/)||(www\.))?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9]{1,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;

  return urlRegExp.test(url);
};

export type HapticType = GenerateHapticFeedbackParams | GenerateHapticFeedbackType | false;

export type ActionProps =
  | (Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> & {
      is?: 'button';
      haptic?: HapticType;
    })
  | (Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'prefix' | 'href'> & {
      is: 'a';
      link?: string;
      haptic?: HapticType;
    });

const ActionComponent = forwardRef<HTMLButtonElement | HTMLAnchorElement, ActionProps>((props, ref) => {
  const { isApp } = useDeviceDetect();
  const { generateHapticFeedback } = useWebInterface();

  const handleClick = (e: any) => {
    if (props.haptic) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      typeof props.haptic === 'string'
        ? generateHapticFeedback({ type: props.haptic })
        : generateHapticFeedback(props.haptic);
    }
    // props onclick 호출
    props?.onClick?.(e);
  };

  // Anchor
  if (props.is === 'a') {
    const { link = '#none', is, haptic, ...rest } = props;

    return isApp || isOtherDomain(link) ? (
      // APP or 외부링크
      <a ref={ref as any} href={link} {...rest} onClick={handleClick} />
    ) : (
      // WEB
      <Link ref={ref as any} to={link} {...rest} onClick={handleClick} />
    );
  }

  // Button
  const { type = 'button', is, haptic, ...rest } = props;
  return <button ref={ref as any} type={type} {...rest} onClick={handleClick} />;
});

/**
 * 스타일이 없는 퓨어한 Button(기본) 혹은 Anchor 컴포넌트를 제공
 */
export const Action = styled(ActionComponent)`
  display: inline-block;
  font-size: inherit;
  line-height: inherit;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-touch-callout: none;
` as React.ForwardRefExoticComponent<ActionProps & React.RefAttributes<HTMLButtonElement | HTMLAnchorElement>> & string;
