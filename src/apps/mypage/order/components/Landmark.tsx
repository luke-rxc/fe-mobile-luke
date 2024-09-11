/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import styled from 'styled-components';
import { theme as globalTheme } from '@styles/theme';
import { Divider } from '@pui/divider';

interface SectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'css'> {
  spacing?: keyof typeof globalTheme.spacing;
  divider?: boolean;
  isError?: boolean;
  isLoading?: boolean;
}

/**
 * Section 컴포넌트
 */
export const Section = styled(
  React.forwardRef<HTMLDivElement, SectionProps>(
    ({ isError, isLoading, spacing, divider, className, children, ...props }, ref) => (
      <section ref={ref} className={className} {...props}>
        {divider && <Divider />}
        {children}
      </section>
    ),
  ),
)`
  display: block;
  background-color: ${({ theme }) => theme.color.background.surface};
  ${({ theme, spacing }) => spacing && `margin-top:${theme.spacing[spacing]}`};
`;

interface MainProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'css'> {
  spacing?: keyof typeof globalTheme.spacing;
  isError?: boolean;
  isLoading?: boolean;
}

/**
 * Main 컴포넌트
 */
export const Main = styled(
  React.forwardRef<HTMLDivElement, MainProps>(({ spacing, className, children, ...props }, ref) => {
    return (
      <main ref={ref} className={className} {...props}>
        {children}
      </main>
    );
  }),
)`
  display: block;
  background-color: ${({ theme }) => theme.color.backgroundLayout.section};

  ${Section} {
    ${({ theme, spacing }) => spacing && `margin-top:${theme.spacing[spacing]}`};

    &:first-child {
      margin-top: 0;
    }
  }
`;
