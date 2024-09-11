import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { useSnackbar } from '@hooks/useSnackbar';
import debug from '@utils/debug';
import { SnackbarProvider } from '.';
import { Snackbar } from './Snackbar';

export default {
  title: `${StoriesMenu.PDS.Feedback}/Toast/Snackbar`,
  component: Snackbar,
  decorators: [
    (Story) => (
      <SnackbarProvider>
        <Story />
      </SnackbarProvider>
    ),
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7273%3A30431',
    },
    docs: { source: { type: 'dynamic', excludeDecorators: true } },
  },
  argTypes: {
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
} as ComponentMeta<typeof Snackbar>;

const snackbarId = 'toast_test_id';

const DefaultTemplate: ComponentStory<typeof Snackbar> = (args) => {
  return <Snackbar {...args} />;
};

export const ImageText = DefaultTemplate.bind({
  snackbarId,
});

ImageText.args = {
  title: 'Image + Text',
  message: 'Image + Text, Message 테스트 입니다.',
  image: {
    src: 'https://rxc.co.kr/assets/index_bg_l.jpg',
  },
};

export const ImageTextAction = DefaultTemplate.bind({ snackbarId });

ImageTextAction.args = {
  title: 'Image + Text + Action',
  message: 'Image + Text + Action, Message 테스트 입니다.',
  image: {
    src: 'https://rxc.co.kr/assets/index_bg_l.jpg',
  },
  action: {
    label: '시청하기',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: any) => {
      window.alert('Action Click');
      // eslint-disable-next-line no-console
      debug.log('Click Event::', evt, id);
    },
  },
};

export const 버튼_하이라이트 = DefaultTemplate.bind({ snackbarId });
버튼_하이라이트.args = {
  title: 'Button Highlighted',
  message: 'Button Highlighted는 customTint 사용',
  image: {
    src: 'https://rxc.co.kr/assets/index_bg_l.jpg',
  },
  action: {
    label: '시청하기',
    highlighted: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: any) => {
      window.alert('Action Click');
      // eslint-disable-next-line no-console
      debug.log('Click Event::', evt, id);
    },
  },
};

export const TextAction = DefaultTemplate.bind({ snackbarId });

TextAction.args = {
  title: 'Text + Action',
  message: 'Text + Action, Message 테스트 입니다.',
  action: {
    label: '시청하기',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: any) => {
      window.alert('Action Click');
      // eslint-disable-next-line no-console
      debug.log('Click Event::', evt, id);
    },
  },
};

export const NoTitle = DefaultTemplate.bind({ snackbarId });

NoTitle.args = {
  message:
    '1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.',
  action: {
    label: '시청하기',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: any) => {
      window.alert('Action Click');
      // eslint-disable-next-line no-console
      debug.log('Click Event::', evt, id);
    },
  },
};

export const NoTitleImage = DefaultTemplate.bind({ snackbarId });

NoTitleImage.args = {
  message:
    '1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.',
  image: {
    src: 'https://rxc.co.kr/assets/index_bg_l.jpg',
  },
  action: {
    label: '시청하기',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: any) => {
      window.alert('Action Click');
      // eslint-disable-next-line no-console
      debug.log('Click Event::', evt, id);
    },
  },
};

export const 텍스트_줄임 = DefaultTemplate.bind({ snackbarId });

텍스트_줄임.args = {
  title:
    '1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.',
  message:
    '1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.1) Toast Message 테스트 입니다.2) Toast Message 테스트 입니다.3) Toast Message 테스트 입니다.4) Toast Message 테스트 입니다.5) Toast Message 테스트 입니다.',
  image: {
    src: 'https://rxc.co.kr/assets/index_bg_l.jpg',
  },
  action: {
    label: '시청하기',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: any) => {
      window.alert('Action Click');
      // eslint-disable-next-line no-console
      debug.log('Click Event::', evt, id);
    },
  },
};

export const Direction = DefaultTemplate.bind({
  snackbarId,
});

Direction.args = {
  title: 'Direction',
  message: '기본값은 top 입니다.',
  image: {
    src: 'https://rxc.co.kr/assets/index_bg_l.jpg',
  },
  direction: 'bottom',
};

export const Top = DefaultTemplate.bind({
  snackbarId,
});

Top.args = {
  title: 'Top',
  message: '기본 설정된 위치(Direction)기준에서, Top만큼 더 차이를 두고 싶을때 사용합니다.',
  image: {
    src: 'https://rxc.co.kr/assets/index_bg_l.jpg',
  },
  top: '20px',
};

export const Variants = DefaultTemplate.bind({
  snackbarId,
});

Variants.args = {
  title: 'Variants',
  message: '기본값은 base 입니다.',
  image: {
    src: 'https://rxc.co.kr/assets/index_bg_l.jpg',
  },
  variants: 'success',
};

export const 활성화시_슬라이드모드 = DefaultTemplate.bind({
  snackbarId,
});

활성화시_슬라이드모드.args = {
  title: '활성화시 슬라이드모드',
  message: '슬라이드형태로 활성화됩니다. direction이 bottom인 경우만 구현되어 있습니다.',
  image: {
    src: 'https://rxc.co.kr/assets/index_bg_l.jpg',
  },
  direction: 'bottom',
  slide: true,
};

export const Fadetime = DefaultTemplate.bind({
  snackbarId,
});

Fadetime.args = {
  title: 'Fade Time',
  message: 'fadeIn 되는 시간(second 기준), fadeOut은 fadeIn / 2로 계산하여 진행',
  image: {
    src: 'https://rxc.co.kr/assets/index_bg_l.jpg',
  },
  fadeTime: 1000,
};

export const 자동으로_사라지는_시간 = DefaultTemplate.bind({
  snackbarId,
});

자동으로_사라지는_시간.args = {
  title: 'autoDismiss',
  message: '활성화 된 후 자동으로 사라지는 시간 (second 기준), 기본값은 false 입니다.',
  image: {
    src: 'https://rxc.co.kr/assets/index_bg_l.jpg',
  },
  autoDismiss: 3000,
};

const Button = styled.button`
  display: block;
  border-bottom: 1px solid #00f;
`;

const HookTemplate: ComponentStory<typeof Snackbar> = () => {
  const { addSnackbar, removeSnackbar } = useSnackbar();
  const handleImageToast = () => {
    addSnackbar({
      autoDismiss: 2000,
      direction: 'center',
      image: {
        src: 'https://rxc.co.kr/assets/index_bg_l.jpg',
      },
      title: 'Title Image',
      message: 'Toast 이미지타입.',
    });
  };
  const handleToast = () => {
    addSnackbar({
      autoDismiss: 2000,
      direction: 'center',
      message: '지금 라이브를 시작했어요!',
      action: {
        label: '시청하기',
        onClick: (evt, id) => {
          // eslint-disable-next-line no-console
          debug.log('Click Event::', evt, id);
        },
      },
    });
  };
  const handleLinkToast = () => {
    addSnackbar({
      autoDismiss: 2000,
      direction: 'top',
      title: '링크이동',
      message: '링크이동 메시지입니다.',
      action: {
        label: 'Move',
        href: 'https://www.rxc.co.kr',
      },
    });
  };
  const handleCloseToast = () => {
    addSnackbar({
      direction: 'top',
      title: '링크이동',
      message: 'Toast 수동 Close',
      action: {
        label: '닫기',
        onClick: (evt, id) => {
          removeSnackbar(id);
        },
      },
    });
  };

  return (
    <>
      <Button type="button" onClick={handleImageToast}>
        Image Toast
      </Button>
      <Button type="button" onClick={handleToast}>
        Action 제어 Toast
      </Button>
      <Button type="button" onClick={handleLinkToast}>
        링크 이동 Toast
      </Button>
      <Button type="button" onClick={handleCloseToast}>
        수동 닫기 Toast
      </Button>
    </>
  );
};

export const UsecaseHook = HookTemplate.bind({});
UsecaseHook.args = {
  autoDismiss: 2000,
  direction: 'top',
  message: 'Snackbar Hook(useSnackbar)을 사용시 addToast메서드를 통해 호출합니다.',
};

UsecaseHook.parameters = {
  docs: { source: { type: 'code' } },
};
