import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import styled from 'styled-components';

import { StoriesMenu } from '@stories/menu';
import { theme as globalTheme, Theme } from '@styles/theme';
import { useMemo } from 'react';

/** Spacing key값 */
type SpacingKeys = keyof Theme['spacing'];
/** Spacing 리스트 */
const SpacingContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 6rem;
  background: ${({ theme }) => theme.color.gray3};
`;

/** Spacing 아이템 */
const Spacing = styled(({ spacing, className }: { spacing: SpacingKeys; className?: string }) => {
  const value = useMemo(() => {
    return spacing.replace(/[^\d]/g, '');
  }, [spacing]);

  const handleClick = () => {
    copy(`theme.spacing.${spacing}`);
    toast.success(`클립보드복사: theme.spacing.${spacing}`);
  };

  return (
    <div className={className} tabIndex={-1} onClick={handleClick}>
      <div>
        <span className="name" children={`spacing_${value}`} />{' '}
        <span className="name" children={`theme.spacing.${spacing}`} />
      </div>
      <div>
        <span className="value" children={`${value}(${globalTheme.spacing[spacing]})`} />
      </div>
      <div>
        <span className="visual" style={{ width: globalTheme.spacing[spacing] }} />
      </div>
    </div>
  );
})`
  display: flex;
  padding: 2.7rem 0 3.3rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.backgroundLayout.line};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.color.states.pressedCell};
  }

  & > div {
    width: 100%;
  }

  .name {
    display: inline-block;
    padding: ${({ theme }) => `${theme.spacing.s8} ${theme.spacing.s16}`};
    border-radius: ${({ theme }) => theme.radius.r6};
    background: linear-gradient(0deg, ${({ theme }) => theme.color.gray8} 0%, ${({ theme }) => theme.color.gray8} 100%),
      ${({ theme }) => theme.color.background.surface};

    font-family: SF Pro Text;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .value {
    font-family: SF Pro Display;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  .visual {
    display: block;
    box-sizing: border-box;
    overflow: hidden;
    height: 3.2rem;
    background: rgba(93, 95, 239, 0.4);
    border: 1px solid rgba(93, 95, 239, 1);
    border-top: 0;
    border-bottom: 0;
  }
`;

export default {
  title: `${StoriesMenu.Foundation}/Spacing`,
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
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7314%3A31243',
      },
    ],
  },
};

const Template = () => {
  return (
    <SpacingContainer>
      <Spacing spacing="s2" />
      <Spacing spacing="s4" />
      <Spacing spacing="s8" />
      <Spacing spacing="s12" />
      <Spacing spacing="s16" />
      <Spacing spacing="s24" />
      <Spacing spacing="s32" />
    </SpacingContainer>
  );
};

export const 기본 = Template.bind({});
