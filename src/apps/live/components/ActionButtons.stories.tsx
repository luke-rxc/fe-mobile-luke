import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import styled from 'styled-components';
import { ActionButtons } from '.';
import { ActionButtonType } from '../constants';

export default {
  title: 'Features/Live/ActionButtons',
  component: ActionButtons,
} as ComponentMeta<typeof ActionButtons>;

const Template: ComponentStory<typeof ActionButtons> = (args) => {
  const [activeButtonType, setActiveButtonType] = useState<ActionButtonType | undefined>(undefined);

  const handleClickChangeActive = (buttonType: ActionButtonType | undefined) => {
    setActiveButtonType(buttonType);
  };

  return (
    <WrapperStyled>
      <ActionButtons {...args} activeButtonType={activeButtonType} onClickChangeActive={handleClickChangeActive} />
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;
  background-color: ${({ theme }) => theme.color.surface};
`;

export const Default = Template.bind({});
Default.args = {};
