import styled from 'styled-components';
import { TitleSection, TitleSectionProps } from '@pui/titleSection';
import { userAgent } from '@utils/ua';

export const TitleSectionForAndroid = styled(({ title, ...rest }: TitleSectionProps) => {
  const { isApp, isAndroid } = userAgent();

  if (!isApp || !isAndroid) {
    return null;
  }

  return <TitleSection {...rest} title={<span className="headline">{title}</span>} />;
})`
  .headline {
    font: ${({ theme }) => theme.fontType.headlineB};
  }
`;
