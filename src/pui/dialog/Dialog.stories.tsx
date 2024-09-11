import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { useDialog, DialogHookProps } from '@hooks/useDialog';
import { ModalModule } from '@modules/ModalModule';
import { Image } from '@pui/image';
import { Bag } from '@pui/icon';
import { Dialog } from './Dialog';

export default {
  title: `${StoriesMenu.PDS.Feedback}/Dialog/Dialog`,
  component: Dialog,
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
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7531%3A32340',
    },
    /** @reference https://github.com/storybookjs/storybook/issues/12022#issuecomment-859540813 */
    docs: { source: { type: 'dynamic', excludeDecorators: true } },
  },
  argTypes: {
    buttonDirection: {
      defaultValue: 'horizontal',
    },
    type: {
      defaultValue: 'alert',
    },
    fadeTime: {
      defaultValue: 0.25,
    },
  },
} as ComponentMeta<typeof Dialog>;

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

const logoIcon = {
  icon: Bag,
} as DialogHookProps['logoIcon'];

const logoIllustration = {
  size: 'free',
  element: (
    <Image
      src="https://cdn-image-dev.prizm.co.kr/goods/20211110/1cbc6615-c6f2-4598-b2fb-d72aa443223d.jpeg"
      alt="Logo Image"
    />
  ),
} as DialogHookProps['logoImage'];

const logoImage = {
  size: '48',
  element: (
    <Image
      src="https://cdn-image-dev.prizm.co.kr/goods/20211110/1cbc6615-c6f2-4598-b2fb-d72aa443223d.jpeg?im=Resize,width=48"
      alt="Logo Image"
    />
  ),
} as DialogHookProps['logoImage'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HookTemplate: ComponentStory<any> = (args: DialogHookProps) => {
  const { openDialog } = useDialog();
  const handleClick = () => {
    openDialog({ ...args });
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

const Template: ComponentStory<typeof Dialog> = ({ ...args }) => {
  return <Dialog {...args} />;
};

export const LOGO_ICON_TYPE = Template.bind({});
LOGO_ICON_TYPE.args = {
  logoIcon,
  title: 'Logo Icon Title(size36)',
  desc: 'Icon Component 사용, 36x36',
  type: 'confirm',
  confirm: {
    cb: () => {
      window.alert('confirm');
    },
  },
};

export const LOGO_IMAGE_BASIC_TYPE = Template.bind({});
LOGO_IMAGE_BASIC_TYPE.args = {
  logoImage,
  title: 'Logo Image Title(size48)',
  desc: '48x48',
  type: 'confirm',
  confirm: {
    cb: () => {
      window.alert('confirm');
    },
  },
};

export const LOGO_IMAGE_FREE_TYPE = Template.bind({});
LOGO_IMAGE_FREE_TYPE.args = {
  logoImage: logoIllustration,
  title: 'Logo Image Title(sizeFree)',
  desc: 'max-width: 280px, max-height: 160px',
  type: 'confirm',
  confirm: {
    cb: () => {
      window.alert('confirm');
    },
  },
};

export const ONLY_TEXT_TYPE = Template.bind({});
ONLY_TEXT_TYPE.args = {
  title: 'Only Text Type',
  desc: '로고나 이미지 없이 진행',
  type: 'confirm',
  confirm: {
    cb: () => {
      window.alert('confirm');
    },
  },
};

export const 버튼_스타일_조정 = Template.bind({});
버튼_스타일_조정.args = {
  title: '버튼 스타일 조정',
  desc: 'confirm props의 variant를 통해 진행',
  type: 'confirm',
  confirm: {
    cb: () => {
      window.alert('confirm');
    },
    variant: 'none',
  },
};

export const 버튼_방향 = Template.bind({});
버튼_방향.args = {
  title: '버튼 방향',
  desc: '기본 값은 horizontal 입니다.',
  type: 'confirm',
  buttonDirection: 'vertical',
  confirm: {
    cb: () => {
      window.alert('confirm');
    },
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
    cb: () => {
      window.alert('confirm');
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
    cb: () => {
      window.alert('confirm');
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
    cb: () => {
      window.alert('confirm');
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

export const UsecaseHook = HookTemplate.bind({});
UsecaseHook.args = {
  title: 'Hook(useDialog)기반 호출',
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
