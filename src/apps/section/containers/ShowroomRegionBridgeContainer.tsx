import styled from 'styled-components';
import noop from 'lodash/noop';
import { userAgent } from '@utils/ua';
import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { Conditional } from '@pui/conditional';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ModalWrapperRenderProps } from '@pui/modal';
import { Select, Option } from '@pui/select';
import { Button } from '@pui/button';
import { Spinner } from '@pui/spinner';
import { AnchorSelect } from '../components/AnchorSelect';
import { useShowroomRegionBridgeService } from '../services/useShowroomRegionBridgeService';

export interface ShowroomRegionBridgeContainerProps extends Partial<ModalWrapperRenderProps> {
  showroomId: number;
}

export const ShowroomRegionBridgeContainer = ({
  showroomId,
  transitionState = 'unmounted',
  onClose = noop,
}: ShowroomRegionBridgeContainerProps) => {
  const { isApp, isIOS } = userAgent();
  const { drawerProps: baseProps } = useDrawerInModal({ transitionState, onClose });

  const { isLoading, regionList, fields, handleRegionChange, handleOpenDatePicker, handleComplete } =
    useShowroomRegionBridgeService({ showroomId });

  const isFull = window.screen.height <= 667;

  const drawerProps = {
    ...baseProps,
    title: { label: '지역·날짜' },
    dragging: true,
    fullHeight: isFull,
  };

  return (
    <Conditional condition={isApp} trueExp={<div />} falseExp={<Drawer {...drawerProps} />}>
      <Wrapper className={isIOS && isApp ? 'is-ios-app' : ''} height={!isFull ? window.innerHeight / 2 : undefined}>
        {isLoading ? (
          <Spinner className="spinner" />
        ) : (
          <>
            <Select
              className="select"
              placeholder="지역 선택"
              size="large"
              value={fields.region}
              onChange={(evt) => handleRegionChange(evt)}
            >
              {regionList?.map(({ name }) => (
                <Option value={name} key={name} disabled={false}>
                  {name}
                </Option>
              ))}
            </Select>
            <AnchorSelect
              className="select"
              placeholder={fields.schedule.label ?? '날짜 선택'}
              size="large"
              onClick={handleOpenDatePicker}
            />

            <div className="button-wrapper">
              <Button
                variant="primary"
                size="large"
                bold
                disabled={!(fields.region && fields.schedule.label)}
                onClick={handleComplete}
              >
                완료
              </Button>
            </div>
          </>
        )}
      </Wrapper>
    </Conditional>
  );
};

const Wrapper = styled.div<{ height?: number }>`
  position: relative;
  width: 100%;
  height: ${({ height }) => (height ? `${height / 10}rem` : '100%')};
  padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24} 0`};

  &.is-ios-app {
    min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  }

  .select + .select {
    margin-top: ${({ theme }) => theme.spacing.s12};
  }

  .button-wrapper {
    position: fixed;
    ${({ theme }) => theme.mixin.safeArea('bottom', 24)};
    left: 0;
    width: 100%;
    padding: 0 2.4rem;

    ${Button} {
      width: 100%;
    }
  }

  .spinner {
    ${({ theme }) => theme.center()};
  }
`;
