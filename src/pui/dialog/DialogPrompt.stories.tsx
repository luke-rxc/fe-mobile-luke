import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { useDialogPrompt, DialogPromptHookProps } from '@hooks/useDialogPrompt';
import { ModalModule } from '@modules/ModalModule';
import { DialogPrompt } from './DialogPrompt';

export default {
  title: `${StoriesMenu.PDS.Feedback}/Dialog/DialogPrompt`,
  component: DialogPrompt,
  decorators: [
    (Story) => (
      <>
        <Story />
        <ModalModule />
      </>
    ),
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/EyIrXkNhjCa35EfuKcWDmy/PRIZM-(WEB)?node-id=317%3A21215',
    },
    /** @reference https://github.com/storybookjs/storybook/issues/12022#issuecomment-859540813 */
    docs: { source: { type: 'dynamic', excludeDecorators: true } },
  },
  argTypes: {
    type: {
      defaultValue: 'alert',
    },
    fadeTime: {
      defaultValue: 0.25,
    },
  },
} as ComponentMeta<typeof DialogPrompt>;

const Button = styled.button`
  border-bottom: 1px solid #00f;
  width: 200px;
  height: 50px;
  background: ${({ theme }) => theme.color.gray70};
  color: ${({ theme }) => theme.color.white};
`;

const BgWrapper = styled.div`
  background: ${({ theme }) => theme.color.white};
  .text {
    line-height: 20px;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HookTemplate: ComponentStory<any> = (args: DialogPromptHookProps) => {
  const { openDialogPrompt } = useDialogPrompt();
  const handleClick = () => {
    openDialogPrompt({ ...args });
  };

  return (
    <BgWrapper>
      <Button type="button" onClick={handleClick}>
        Open Dialog Button
      </Button>
      <hr />
      <p className="text">1. Dialog는 Hook 기반으로만 호출이 가능합니다.</p>
      <p className="text">2. Modal을 기반으로 호출합니다.(내부 로직 useModal 활용)</p>
    </BgWrapper>
  );
};

const Template: ComponentStory<typeof DialogPrompt> = ({ ...args }) => {
  return <DialogPrompt {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  title: 'Title',
  desc: 'Message',
};

export const 버튼_스타일_조정 = Template.bind({});
버튼_스타일_조정.args = {
  title: '버튼 스타일 조정',
  desc: 'confirm props의 variant를 통해 진행',
  type: 'confirm',
  confirm: {
    cb: (value: string) => {
      window.alert(`Confirm: 입력된 값은 ${value}입니다.`);
    },
    variant: 'none',
  },
};

export const TEXT_2줄제한 = Template.bind({});
TEXT_2줄제한.args = {
  title:
    '[타이틀] 텍스트는 2줄까지 표현되고, 그 이상은 점점점으로 표시됩니다. 텍스트는 2줄까지 표현되고, 그 이상은 점점점으로 표시됩니다. 텍스트는 2줄까지 표현되고, 그 이상은 점점점으로 표시됩니다.',
  desc: '[Description] 텍스트는 2줄까지 표현되고, 그 이상은 점점점으로 표시됩니다. 텍스트는 2줄까지 표현되고, 그 이상은 점점점으로 표시됩니다. 텍스트는 2줄까지 표현되고, 그 이상은 점점점으로 표시됩니다.',
  type: 'confirm',
  buttonDirection: 'vertical',
  confirm: {
    cb: (value: string) => {
      window.alert(`Confirm: 입력된 값은 ${value}입니다.`);
    },
  },
};

export const ALERT = Template.bind({});
ALERT.args = {
  title: 'Alert Type',
  desc: 'Type의 기본값은 Alert 이며, Alert 타입은 confirm prop만 반영합니다.',
};

export const CONFIRM = Template.bind({});
CONFIRM.args = {
  title: 'Confirm Type',
  desc: 'Confirm type 은 confirm, cancel prop을 반영합니다.',
  type: 'confirm',
  confirm: {
    cb: (value: string) => {
      window.alert(`Confirm: 입력된 값은 ${value}입니다.`);
    },
  },
  cancel: {
    cb: () => {
      window.alert('cancel');
    },
  },
};

export const CONFIRM_LABEL = Template.bind({});
CONFIRM_LABEL.args = {
  title: 'Confirm Type',
  desc: 'Confirm type 은 confirm, cancel prop내 Labeling을 변경할 수 있습니다.',
  type: 'confirm',
  confirm: {
    cb: (value: string) => {
      window.alert(`Confirm: 입력된 값은 ${value}입니다.`);
    },
    label: '할께요',
  },
  cancel: {
    cb: () => {
      window.alert('cancel');
    },
    label: '안할래요',
  },
};

export const TEXTFIELD = Template.bind({});
TEXTFIELD.args = {
  title: 'TextField',
  desc: 'Pui의 TextField Props를 기반으로 진행',
  textField: {
    type: 'number',
    placeholder: '플레이스 홀더',
  },
};

export const UsecaseHook = HookTemplate.bind({});
UsecaseHook.args = {
  title: 'Hook(useDialogPrompt)기반 호출',
  desc: 'Dialog는 Hook을 통해서만 가능합니다.',
};
UsecaseHook.parameters = {
  docs: { source: { type: 'code' } },
};

/** @todo hooks code view 에 대한 체크 필요 */
export const HookFadetime = HookTemplate.bind({});
HookFadetime.args = {
  title: 'FadeTime 조정',
  desc: '초 단위로 Dialog가 open 되는 시간 결정',
  fadeTime: 2,
};

export const HookBackdropDisabled = HookTemplate.bind({});
HookBackdropDisabled.args = {
  title: 'BackDrop Disable',
  desc: 'Hook Props 에는 Modal의 기능을 제어하는 Props가 존재',
  disableBackDropClose: true,
};
