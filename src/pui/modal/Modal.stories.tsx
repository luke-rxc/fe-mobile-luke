import { useState } from 'react';
import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { useModal } from '@hooks/useModal';
import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { Button } from '@pui/button';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ModalModule } from '@modules/ModalModule';
import { Modal } from './Modal';
import { ModalWrapper, ModalWrapperRenderProps } from './ModalWrapper';

export default {
  title: `${StoriesMenu.NonPDS}/Modal`,
  component: ModalWrapper,
  decorators: [
    (Story) => (
      <>
        <Story />
        <ModalModule />
      </>
    ),
  ],
} as ComponentMeta<typeof ModalWrapper>;

const BodyFakeContentWrapper = styled.div`
  & p {
    height: 200px;
  }
`;

const BgWrapper = styled.div`
  color: ${({ theme }) => theme.color.black};
`;

const BodyFakeContent = () => (
  <BodyFakeContentWrapper>
    <hr />
    <p>Text01</p>
    <p>Text</p>
    <p>Text</p>
    <p>Text</p>
    <p>Text321</p>
    <p>Text</p>
    <p>Text</p>
    <p>Text</p>
    <p>Text</p>
    <p>Text</p>
    <p>Text99</p>
  </BodyFakeContentWrapper>
);

/**
 * Base Template (Hook base)
 */
const Template: ComponentStory<typeof ModalWrapper> = ({ ...args }) => {
  const { openModal } = useModal();

  const handleClick = () => {
    openModal({
      render: ({ onClose: handleClose }) => (
        <BgWrapper>
          <p>Modal</p>
          <p>
            감각적인 메이크업 제품부터 스킨, 헤어케어 제품까지. 프리즘 뷰티 박스의 다양한 라인업을 만나보세요!
            <br />• 에이지투웨니스 : 퍼펙트 글래스 에센스 커버 팩트
            <br />• 달바 : 글로우 핏 세럼 커버 쿠션 • 디어달리아 : 에포트리스 매트 립스틱
            <br />• 쥬스투클렌즈 : 그레인 수 클렌징 오일
            <br />• 비플레인 : 시카풀 카밍 패드
            <br />• 차홍 : 인텐시브 리페어 앰플
            <br />• 원오세븐 : 소서 빈바이옴 비타민C 세럼
            <br />• 셀퓨전씨 : 약산성 패리어 수분 크림
            <br />• 본결 : 약쑥 큐어 시트 마스크
          </p>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </BgWrapper>
      ),
      ...args,
    });
  };

  return (
    <>
      <Button variant="primary" onClick={handleClick}>
        Open Modal
      </Button>
      <BodyFakeContent />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};

export const Radius = Template.bind({});
Radius.args = {
  radius: '1rem',
};

export const 풀사이징 = Template.bind({});
풀사이징.args = {
  fullSize: true,
};

export const 모달기본BG를_사용하지_않음 = Template.bind({});
모달기본BG를_사용하지_않음.args = {
  nonInnerBg: true,
  fullSize: true,
};

export const widthHeight = Template.bind({});
widthHeight.args = {
  width: '50rem',
  height: '400px',
};

export const 페이드인아웃 = Template.bind({});
페이드인아웃.args = {
  fadeTime: 1,
};

export const transitionTimeout = Template.bind({});
transitionTimeout.args = {
  timeout: 2,
};

export const 배경클릭시_닫기_금지 = Template.bind({});
배경클릭시_닫기_금지.args = {
  disableBackDropClose: true,
};

export const 배경클릭시_액션제어 = Template.bind({});
배경클릭시_액션제어.args = {
  disableBackDropClose: true,
  onBackDropClick: () => {
    // eslint-disable-next-line no-console
    console.log('배경클릭!');
  },
};

/**
 * Hook 사용시
 */
const SubModal = (props: ModalWrapperRenderProps) => {
  const handleClose = () => {
    return props.onClose ? props.onClose() : null;
  };
  return (
    <BgWrapper>
      <p>Modal</p>
      <hr />
      <div>TestComp</div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <Button variant="primary" onClick={handleClose}>
        Close
      </Button>
    </BgWrapper>
  );
};

const HookTemplate: ComponentStory<typeof ModalWrapper> = () => {
  const { openModal } = useModal();

  const handleClick = () => {
    openModal({
      width: '400px',
      radius: '1rem',
      render: ({ onClose: handleClose }) => {
        const handleModalOpen = () => {
          openModal({
            disableBackDropClose: true,
            radius: '10px',
            fadeTime: 0.5,
            render: SubModal,
          });
        };

        return (
          <BgWrapper>
            <p>Modal</p>
            <p>Modal Render</p>
            <br />
            <Button variant="primary" onClick={handleModalOpen}>
              Other Modal Open
            </Button>
            <br />
            <br />
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          </BgWrapper>
        );
      },
    });
  };

  return (
    <>
      <p>모달 Hook 사용시</p>
      <br />
      <Button variant="primary" onClick={handleClick}>
        Hook
      </Button>
      <BodyFakeContent />
    </>
  );
};

export const UsecaseHook = HookTemplate.bind({});

/**
 * 모달 컴포넌트 직접 사용시
 */
const ModalComponentTemplate: ComponentStory<typeof Modal> = ({ ...args }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const modalProps = {
    ...args,
    open: modalOpen,
  };
  return (
    <>
      <p>모달 컴포넌트 직접 사용시</p>
      <br />
      <Button variant="primary" onClick={handleModalOpen}>
        Modal Open
      </Button>
      <Modal {...modalProps} onClose={handleModalClose}>
        <BgWrapper>
          <BodyFakeContent />
        </BgWrapper>
      </Modal>
    </>
  );
};

export const UsecaseComponent = ModalComponentTemplate.bind({});
UsecaseComponent.args = {
  fadeTime: 1,
};

/**
 * Drawer Modal 사용시
 * - Component 내부에 Drawer PUI 사용
 * - useDrawerInModal 을 사용하고 해당 Drawer 컴포넌트에 drawerProps 를 연결
 */
const DrawerModal = ({ onClose: handleClose, transitionState }: ModalWrapperRenderProps) => {
  const { drawerProps } = useDrawerInModal({
    onClose: handleClose,
    transitionState,
  });
  return (
    <Drawer
      {...drawerProps}
      title={{
        label: 'Drawer Modal',
      }}
      dragging
    >
      <p>Modal</p>
      <hr />
      <div>TestComp</div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <Button variant="primary" onClick={handleClose}>
        Close
      </Button>
    </Drawer>
  );
};

const HookDrawerModalTemplate: ComponentStory<typeof ModalWrapper> = () => {
  const { openModal } = useModal();

  const handleClick = () => {
    openModal({
      /** Wrapper를 기본 Modal Wrapper로 사용하지 않는다 */
      nonModalWrapper: true,
      /** 반드시 해당 Props를 Children Component(DrawerModal) Props 에 전달 */
      render: (props) => <DrawerModal {...props} />,
    });
  };

  return (
    <>
      <p>Drawer Modal 사용</p>
      <br />
      <Button variant="primary" onClick={handleClick}>
        Hook
      </Button>
      <BodyFakeContent />
    </>
  );
};

export const HookDrawerModal = HookDrawerModalTemplate.bind({});
