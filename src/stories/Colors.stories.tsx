import { ComponentStory, ComponentMeta } from '@storybook/react';
import get from 'lodash/get';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import styled from 'styled-components';

import { StoriesMenu } from '@stories/menu';
import { convertRGBAToHex } from '@utils/color';
import { Action } from '@pui/action';

const extractAlpha = (rgbaCode: string) => {
  const match = rgbaCode.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(\d*(?:\.\d+)?)\s*\)/);

  if (match) {
    const alpha = parseFloat(match[1]);
    const alphaPercentage = (alpha * 100).toFixed(0);
    return `${alphaPercentage}%`;
  }

  return null;
};

/** 타이틀 */
const Title = styled.h2`
  width: 100%;
  margin: 10rem 0 2rem;
  padding: 0 0 2rem;
  font: ${({ theme }) => theme.fontType.t20B};
`;

/** 색상 리스트 */
const ColorChipContainer = styled.div`
  line-height: 0;
  &:nth-child(1) ${Title} {
    margin-top: 1rem;
  }
`;

/** 색상 리스트 아이템 */
const ColorChip = styled(
  ({ className, themeColorName }: { className?: string; themeColorName: string; textColor: string }) => {
    const handelClick = () => {
      copy(`theme.color.${themeColorName}`);
      toast.success(`클립보드복사: theme.color.${themeColorName}`);
    };

    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    return <button type="button" className={className} children={<div />} onClick={handelClick} />;
  },
)`
  display: inline-block;
  position: relative;
  max-width: 43rem;
  width: 25%;
  margin: 1rem;
  background: ${({ theme, themeColorName }) => get(theme.color, themeColorName)};
  transition: transform 0.3s ease-in-out;
  box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.12);

  &:hover {
    transform: scale(0.98);
  }

  & > div {
    padding-top: 68.4931506849315%;
  }

  &:before,
  &:after,
  & > div:after {
    position: absolute;
    left: 2rem;
    font: ${({ theme }) => theme.fontType.t15};
    color: ${({ theme, textColor }) => get(theme.color, textColor, textColor)};
  }

  &:before {
    top: 2rem;
    font-weight: bold;
    content: ${({ themeColorName }) => `'${themeColorName}'`};
  }

  &:after {
    bottom: 2rem;
    content: ${({ theme, themeColorName }) =>
      `'${convertRGBAToHex(get(theme.color, themeColorName, themeColorName)).toLocaleUpperCase()}'`};
  }

  & > div:after {
    left: 100%;
    bottom: 2rem;
    transform: translateX(calc(-100% - 2rem));
    content: ${({ theme, themeColorName }) => `'${extractAlpha(get(theme.color, themeColorName, themeColorName))}'`};
  }
`;

const Box = styled.div``;

export default {
  title: `${StoriesMenu.Foundation}/Colors`,
  parameters: {
    viewMode: 'story',
    design: [
      {
        name: 'light mode',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7465%3A32479',
      },
      {
        name: 'dark mode',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7472%3A30789',
      },
    ],
  },
} as ComponentMeta<typeof Box>;

const Template: ComponentStory<typeof Box> = ({ children, ...args }) => (
  <Box
    {...args}
    children={
      children || (
        <Action
          is="a"
          target="_blank"
          link="https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=31847-108905&mode=design&t=sHJHnR6NLuu4I0OS-4"
          children="피그마 링크"
        />
      )
    }
  />
);

export const docs = Template.bind({});
export const FoundationNeutral = Template.bind({});
FoundationNeutral.args = {
  children: (
    <ColorChipContainer>
      <ColorChip themeColorName="white" textColor="tint" />
      <ColorChip themeColorName="gray3" textColor="tint" />
      <ColorChip themeColorName="gray8" textColor="tint" />
      <ColorChip themeColorName="gray20" textColor="tint" />
      <ColorChip themeColorName="gray50" textColor="tint" />
      <ColorChip themeColorName="gray70" textColor="tint" />
      <ColorChip themeColorName="black" textColor="white" />
      <ColorChip themeColorName="whiteVariant2" textColor="tint" />
      <ColorChip themeColorName="whiteVariant1" textColor="tint" />
      <ColorChip themeColorName="grayBg" textColor="tint" />
      <ColorChip themeColorName="gray8Filled" textColor="tint" />
      <ColorChip themeColorName="white20" textColor="tint" />
      <ColorChip themeColorName="white70" textColor="tint" />
    </ColorChipContainer>
  ),
};

export const FoundationNeutralFixed = Template.bind({});
FoundationNeutralFixed.args = {
  children: (
    <ColorChipContainer>
      <ColorChip themeColorName="whiteLight" textColor="#000" />
      <ColorChip themeColorName="gray20Light" textColor="tint" />
      <ColorChip themeColorName="gray50Light" textColor="tint" />
      <ColorChip themeColorName="gray70Light" textColor="tint" />
      <ColorChip themeColorName="gray50Dark" textColor="tint" />
      <ColorChip themeColorName="blackLight" textColor="#fff" />
    </ColorChipContainer>
  ),
};
export const FoundationEtc = Template.bind({});
FoundationEtc.args = {
  children: (
    <ColorChipContainer>
      <ColorChip themeColorName="red" textColor="white" />
      <ColorChip themeColorName="green" textColor="gray70" />
    </ColorChipContainer>
  ),
};

export const TokenBrand = Template.bind({});
TokenBrand.args = {
  children: (
    <ColorChipContainer>
      <ColorChip themeColorName="tint" textColor="white" />
      <ColorChip themeColorName="tint3" textColor="gray70" />
    </ColorChipContainer>
  ),
};

export const TokenBackground = Template.bind({});
TokenBackground.args = {
  children: (
    <ColorChipContainer>
      <ColorChip themeColorName="background.surface" textColor="tint" />
      <ColorChip themeColorName="background.surfaceHigh" textColor="tint" />
      <ColorChip themeColorName="background.bg" textColor="tint" />
    </ColorChipContainer>
  ),
};

export const TokenBackgroundLayout = Template.bind({});
TokenBackgroundLayout.args = {
  children: (
    <ColorChipContainer>
      <ColorChip themeColorName="backgroundLayout.section" textColor="tint" />
      <ColorChip themeColorName="backgroundLayout.line" textColor="tint" />
    </ColorChipContainer>
  ),
};

export const TokenStates = Template.bind({});
TokenStates.args = {
  children: (
    <ColorChipContainer>
      <ColorChip themeColorName="states.disabledBg" textColor="tint" />
      <ColorChip themeColorName="states.selectedBg" textColor="tint" />
      <ColorChip themeColorName="states.disabledMedia" textColor="tint" />
      <ColorChip themeColorName="states.pressedMedia" textColor="tint" />
      <ColorChip themeColorName="states.pressedPrimary" textColor="tint" />
      <ColorChip themeColorName="states.pressedCell" textColor="tint" />
    </ColorChipContainer>
  ),
};

export const TokenText = Template.bind({});
TokenText.args = {
  children: (
    <ColorChipContainer>
      <ColorChip themeColorName="text.textPrimary" textColor="white" />
      <ColorChip themeColorName="text.textSecondary" textColor="tint" />
      <ColorChip themeColorName="text.textTertiary" textColor="tint" />
      <ColorChip themeColorName="text.textLink" textColor="white" />
      <ColorChip themeColorName="text.textHelper" textColor="tint" />
      <ColorChip themeColorName="text.textPlaceholder" textColor="tint" />
      <ColorChip themeColorName="text.textDisabled" textColor="tint" />
    </ColorChipContainer>
  ),
};
export const TokenSemantic = Template.bind({});
TokenSemantic.args = {
  children: (
    <ColorChipContainer>
      <ColorChip themeColorName="semantic.error" textColor="white" />
      <ColorChip themeColorName="semantic.sale" textColor="white" />
      <ColorChip themeColorName="semantic.live" textColor="white" />
      <ColorChip themeColorName="semantic.noti" textColor="white" />
      <ColorChip themeColorName="semantic.like" textColor="white" />
    </ColorChipContainer>
  ),
};
