import { useMemo } from 'react';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import styled from 'styled-components';

import { StoriesMenu } from '@stories/menu';
import { Theme } from '@styles/theme';

/** Radius key값 */
type RadiusKeys = keyof Theme['radius'];
/** Radius 리스트 */
const RadiusContainer = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6rem;
  background: ${({ theme }) => theme.color.gray3};
  & > * {
    width: 100%;
    padding: 6rem 2rem;
  }
`;

/** Radius 아이템 */
const Radius = styled(({ radius, className }: { radius: RadiusKeys; className?: string }) => {
  const value = useMemo(() => {
    return radius.replace(/[^\d]/g, '');
  }, [radius]);

  const handleClick = () => {
    copy(`theme.radius.${radius}`);
    toast.success(`클립보드복사: theme.radius.${radius}`);
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      <span className="radius-box" />
      <span className="radius-label" children={`radius_${value}`} />{' '}
      <span className="radius-label" children={`theme.radius.${radius}`} />
      <span className="radius-value" children={`${value}`} />
    </button>
  );
})`
  &:hover {
    background: ${({ theme }) => theme.color.states.pressedCell};
  }

  .radius-box {
    display: block;
    width: 100%;
    height: 12rem;
    background: ${({ theme }) => theme.color.background.surface};
    box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.04);
    border-radius: ${({ theme, radius }) => theme.radius[radius]};
  }
  .radius-label {
    display: inline-block;
    margin: 3.5rem 0;
    padding: ${({ theme }) => `${theme.spacing.s8} ${theme.spacing.s16}`};
    border-radius: ${({ theme }) => theme.radius.r6};
    background: linear-gradient(0deg, ${({ theme }) => theme.color.gray8} 0%, ${({ theme }) => theme.color.gray8} 100%),
      ${({ theme }) => theme.color.background.surface};

    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .radius-value {
    display: block;
    padding-top: 3.5rem;
    border-top: 1px solid ${({ theme }) => theme.color.backgroundLayout.line};
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

export default {
  title: `${StoriesMenu.Foundation}/Radius`,
  parameters: {
    viewMode: 'story',
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    design: [
      {
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=8084%3A38632',
      },
    ],
  },
};

const Template = () => {
  return (
    <RadiusContainer>
      <Radius radius="r4" />
      <Radius radius="r6" />
      <Radius radius="r8" />
      <Radius radius="r12" />
    </RadiusContainer>
  );
};

export const 기본 = Template.bind({});
