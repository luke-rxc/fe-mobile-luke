import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@pui/button';
import { ModalModule } from '@modules/ModalModule';
import { Drawer, DrawerDefault } from '.';

export default {
  title: `${StoriesMenu.NonPDS}/Drawer`,
  component: Drawer,
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
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7541%3A32372',
    },
    docs: { source: { type: 'dynamic', excludeDecorators: true } },
  },
} as ComponentMeta<typeof Drawer>;

const Paragraph = styled.p`
  height: 50px;
`;

const InnerDrawerContents = () => (
  <>
    <Paragraph>====== Start Drawer =========</Paragraph>
    <Paragraph>Text</Paragraph>
    <Paragraph>PRIZM IS START!!!</Paragraph>
    <Paragraph>PRIZM IS START!!!</Paragraph>
    <Paragraph>PRIZM IS START!!!</Paragraph>
    <Paragraph>PRIZM IS START!!!</Paragraph>
    <Paragraph>PRIZM IS START!!!</Paragraph>
    <Paragraph>PRIZM IS START!!!</Paragraph>
    <Paragraph>PRIZM IS START!!!</Paragraph>
    <Paragraph>Text</Paragraph>
    <Paragraph>====== End Drawer =========</Paragraph>
  </>
);

/**
 * Default
 */
const Template: ComponentStory<typeof Drawer> = (args) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Button variant="primary" onClick={handleOpen}>
        Drawer
      </Button>
      <Drawer {...args} open={open} onClose={handleClose}>
        <div style={{ background: 'skyblue' }}>
          <InnerDrawerContents />
        </div>
      </Drawer>
    </div>
  );
};

const { transitionDuration, dragging, expandView, backDropProps, draggingProps, nonPortal } = DrawerDefault;
const defaultArgs = { transitionDuration, dragging, expandView, backDropProps, draggingProps, nonPortal };
export const Default = Template.bind({});
Default.args = defaultArgs;

export const 상단헤더_크기만_남기고_끝까지_올림 = Template.bind({});
상단헤더_크기만_남기고_끝까지_올림.args = {
  ...defaultArgs,
  fullHeight: true,
};

export const TitleLabel = Template.bind({});
TitleLabel.args = {
  ...defaultArgs,
  title: {
    label: '타이틀 입니다',
  },
};

export const 트랜지션_속도 = Template.bind({});
트랜지션_속도.args = {
  ...defaultArgs,
  transitionDuration: 1000,
};

export const BackdropDesign = Template.bind({});
BackdropDesign.args = {
  backDropProps: {
    bgColor: '#111',
    opacity: 1,
    disableBackDropClose: true,
    onBackDropClick: () => {
      window.alert('Backdrop Click');
    },
    transitionDuration: 1000,
  },
};

export const CloseCompleteCallback = Template.bind({});
CloseCompleteCallback.args = {
  ...defaultArgs,
  onCloseComplete: () => {
    window.alert('Drawer Close Callback');
  },
};

const DragTemplate: ComponentStory<typeof Drawer> = (args) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Button variant="primary" onClick={handleOpen}>
        Drawer
      </Button>
      <Drawer {...args} open={open} onClose={handleClose}>
        <div style={{ background: '#fff', height: '500px' }}>
          <div style={{ height: '200px', border: '1px solid #000', overflowY: 'scroll' }}>
            <InnerDrawerContents />
            <InnerDrawerContents />
            <InnerDrawerContents />
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export const DraggingDefault = DragTemplate.bind({});
DraggingDefault.args = {
  dragging: true,
};

export const DraggingExpandView = Template.bind({});
DraggingExpandView.args = {
  expandView: true,
  dragging: true,
};

export const DraggingExpandViewTo지정 = Template.bind({});
DraggingExpandViewTo지정.args = {
  expandView: true,
  dragging: true,
  to: '-50%',
};

export const DraggingCloseConfirm = Template.bind({});
DraggingCloseConfirm.args = {
  title: '드래깅할때 Close 여부 묻기',
  dragging: true,
  draggingProps: {
    closeConfirm: {
      title: '닫을거예요?',
      message: '닫으면 Callback',
      disableForceClose: true,
      cb: () => {
        window.alert('Close Drawer');
      },
    },
  },
};
