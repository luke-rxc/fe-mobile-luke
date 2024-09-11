/* eslint-disable react-hooks/exhaustive-deps */
import merge from 'lodash/merge';
import styled from 'styled-components';
import { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { ModalWrapperRenderProps } from '@pui/modal';
import { PageError } from '@features/exception/components';
import { Spinner } from '@pui/spinner';
import { useTeaserService } from '../services';
import { Teaser } from '../components';

export interface TeaserModalContainerProps extends ModalWrapperRenderProps {
  /** 편성표 ID */
  scheduleId: number;
  /** 모달 타이틀 */
  title?: string;
  /** 클래스명 */
  className?: string;
}

/**
 * schedule teaser Modal
 */
export const TeaserModalContainer = styled(
  ({ title, scheduleId, transitionState, className, onClose }: TeaserModalContainerProps) => {
    const { pathname } = useLocation();
    const { drawerProps: defaultDrawerProps } = useDrawerInModal({ onClose, transitionState });
    const { data, error, status, handler } = useTeaserService({ scheduleId });

    /**
     * drawerProps overriding
     */
    const drawerProps = merge({}, defaultDrawerProps, { backDropProps: { disableBackDropClose: false } });

    /**
     * 모달 타이틀
     */
    const modalTitle = useMemo(() => {
      const label = title || data?.host.title;
      return label ? { label } : undefined;
    }, [title, data]);

    /**
     * 페이지 이동시 모달 close
     */
    useEffect(() => () => onClose(), [pathname]);

    return (
      <Drawer {...drawerProps} dragging expandView title={modalTitle} className={className}>
        {/* loading */}
        {status === 'loading' && <Spinner className="drawer-spinner" />}

        {/* error */}
        {status === 'error' && <PageError className="drawer-exception" isFull={false} {...error} />}

        {/* success */}
        {status === 'success' && data && (
          <Teaser
            {...data}
            onClickLiveFollow={handler.changeLiveFollow}
            onClickBrandFollow={handler.changeBrandFollow}
          />
        )}
      </Drawer>
    );
  },
)`
  .drawer-spinner,
  .drawer-exception {
    ${({ theme }) => theme.mixin.centerItem()};
    height: 100%;
  }
`;
