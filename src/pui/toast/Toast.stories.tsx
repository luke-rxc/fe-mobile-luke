import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { useToast } from '@hooks/useToast';
import { ToastModule } from '@modules/ToastModule';
import { Toast } from './Toast';

export default {
  title: `${StoriesMenu.PDS.Feedback}/Toast/Toast`,
  component: Toast,
  decorators: [
    (Story) => (
      <>
        <Story />
        <ToastModule />
      </>
    ),
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7273%3A30708',
    },
    docs: { source: { type: 'dynamic', excludeDecorators: true } },
  },
  argTypes: {
    align: {
      defaultValue: 'center',
    },
    direction: {
      defaultValue: 'top',
    },
    variants: {
      defaultValue: 'base',
    },
    autoDismiss: {
      defaultValue: false,
    },
    slide: {
      defaultValue: false,
    },
    fadeTime: {
      defaultValue: 250,
    },
  },
} as ComponentMeta<typeof Toast>;

const toastId = 'toast_test_id';

const DefaultTemplate: ComponentStory<typeof Toast> = (args) => {
  return <Toast {...args} />;
};

export const Default = DefaultTemplate.bind({
  toastId,
});

Default.args = {
  message: 'Toast Message 테스트 입니다.',
};

export const 두줄_입력 = DefaultTemplate.bind({
  toastId,
});

두줄_입력.args = {
  message:
    '1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.',
};

export const 의도적_줄바꿈 = DefaultTemplate.bind({
  toastId,
});

의도적_줄바꿈.args = {
  message: '1) Toast Message 테스트 입니다.\r\n2) Toast Message 테스트 입니다.',
};

export const 문자열_정렬 = DefaultTemplate.bind({
  toastId,
});

문자열_정렬.args = {
  message: '기본값은 center 입니다.',
  align: 'left',
};

export const Direction = DefaultTemplate.bind({
  toastId,
});

Direction.args = {
  message: '기본값은 top 입니다.',
  direction: 'bottom',
};

export const Top = DefaultTemplate.bind({
  toastId,
});

Top.args = {
  message: '기본 설정된 위치(Direction)기준에서, Top만큼 더 차이를 두고 싶을때 사용합니다.',
  top: '20px',
};

export const Variants = DefaultTemplate.bind({
  toastId,
});

Variants.args = {
  message: '기본값은 base 입니다.',
  variants: 'success',
};

export const 활성화시_슬라이드모드 = DefaultTemplate.bind({
  toastId,
});

활성화시_슬라이드모드.args = {
  message: '슬라이드형태로 활성화됩니다. direction이 bottom인 경우만 구현되어 있습니다.',
  direction: 'bottom',
  slide: true,
};

export const Fadetime = DefaultTemplate.bind({
  toastId,
});

Fadetime.args = {
  message: 'fadeIn 되는 시간(second 기준), fadeOut은 fadeIn / 2로 계산하여 진행',
  fadeTime: 1000,
};

export const 자동으로_사라지는_시간 = DefaultTemplate.bind({
  toastId,
});

자동으로_사라지는_시간.args = {
  message: '활성화 된 후 자동으로 사라지는 시간 (second 기준), 기본값은 3초 입니다.',
  autoDismiss: 3000,
};

const Button = styled.button`
  display: block;
  border-bottom: 1px solid #00f;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HookTemplate: ComponentStory<typeof Toast | any> = (args) => {
  const { addToast } = useToast();
  // toast 기본형
  /**
   * @arguments
   ```
   args: {
    autoDismiss: 2000,
    direction: 'top',
    message: 'Toast Hook(useToast)을 사용시 addToast메서드를 통해 호출합니다.',
   }
   ```
   */
  const handleBaseToast = () => {
    addToast({
      ...args,
    });
  };

  return (
    <Button type="button" onClick={handleBaseToast}>
      Toast Open
    </Button>
  );
};

export const UsecaseHook = HookTemplate.bind({});
UsecaseHook.args = {
  autoDismiss: 2000,
  direction: 'top',
  message: 'Toast Hook(useToast)을 사용시 addToast메서드를 통해 호출합니다.',
};

UsecaseHook.parameters = {
  docs: { source: { type: 'code' } },
};
