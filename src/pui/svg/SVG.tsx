import { forwardRef } from 'react';
import styled from 'styled-components';
import InlineSVG, { Props as InlineSVGProps } from 'react-inlinesvg';

export type SVGProps = InlineSVGProps & {
  /** svg 다크모드 미적용 옵션 */
  noDarkMode?: boolean;
};

const SVGComponent = forwardRef<InlineSVG, SVGProps>(({ src, className, ...props }, ref) => (
  <InlineSVG src={src} className={className} {...props} ref={ref} />
));

export const SVG = styled(SVGComponent)`
  & * {
    fill: ${({ theme, noDarkMode }) =>
      !noDarkMode && theme.isDarkMode ? `${theme.color.whiteLight} !important` : 'inherit'};
    filter: ${({ theme, noDarkMode }) => (!noDarkMode && theme.isDarkMode ? 'none !important' : 'inherit')};
  }
`;
