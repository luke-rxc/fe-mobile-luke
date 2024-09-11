import styled from 'styled-components';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import noop from 'lodash/noop';
import { PageError } from '@features/exception/components';
import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { Button, ButtonProps } from '@pui/button';
import { Conditional } from '@pui/conditional';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { Divider } from '@pui/divider';
import type { ModalWrapperRenderProps } from '@pui/modal';
import { Spinner } from '@pui/spinner';
import { userAgent } from '@utils/ua';
import { FilterSection } from '../components';
import { useShowroomRegionTagService } from '../services';
import { useRegionStore } from '../stores';

interface Props extends Partial<ModalWrapperRenderProps> {
  showroomId: number;
}

export const ShowroomRegionFilterContainer = ({ showroomId, transitionState = 'unmounted', onClose = noop }: Props) => {
  const { isApp, isIOS } = userAgent();
  const { drawerProps: baseProps } = useDrawerInModal({ transitionState, onClose });
  const { data, isError, isLoading, handleClearTags, handleClickComplete } = useShowroomRegionTagService(showroomId);

  const drawerProps = {
    ...baseProps,
    title: { label: '필터' },
    dragging: true,
    ...(!isApp && {
      toolbarSuffix: <ToolbarClearButton onClick={handleClearTags}>초기화</ToolbarClearButton>,
    }),
  };

  // 선택된 태그 유무
  const hasSelectedTags = !!data?.sanitizeTags.length;

  /* eslint-disable no-nested-ternary */
  return (
    <Conditional condition={isApp} trueExp={<div />} falseExp={<Drawer {...drawerProps} />}>
      <Wrapper className={classnames({ 'is-ios-app': isIOS && isApp })}>
        {isLoading ? (
          // Loading
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        ) : isError ? (
          // Error
          <PageError description="일시적인 오류가 발생하였습니다" />
        ) : isEmpty(data?.tagFilter) ? (
          // Empty
          <PageError description="선택할 수 있는 필터가 없습니다" />
        ) : (
          // Tag List
          data?.tagFilter.map((section, index, rows) => {
            // 마지막 섹션 여부
            const isLastSection = index === rows.length - 1;

            return (
              <section key={section.tagGroupId} className="filter-section">
                <FilterSection expandFirstGroup={!hasSelectedTags} data={section} />
                {!isLastSection && <Divider />}
              </section>
            );
          })
        )}
        <div className="button-wrapper">
          <Button
            disabled={isLoading}
            variant="primary"
            size="large"
            type="submit"
            block
            bold
            onClick={handleClickComplete}
          >
            완료
          </Button>
        </div>
      </Wrapper>
    </Conditional>
  );
  /* eslint-enable no-nested-ternary */
};

const ToolbarClearButton = styled((props: ButtonProps) => {
  const disabled = useRegionStore((state) => state.clearButton.disabled);

  return (
    <Button size="regular" disabled={disabled} {...props}>
      초기화
    </Button>
  );
})`
  &.is-disabled {
    color: ${({ theme }) => theme.color.gray20};
  }
`;

const SpinnerWrapper = styled.div`
  ${({ theme }) => theme.mixin.fixed({ t: 0, l: 0 })};
  ${({ theme }) => theme.mixin.centerItem()};
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div`
  /* 완료 CTA 영역 top:16 + height:56 + bottom:24 */
  margin-bottom: 9.6rem;

  &.is-ios-app {
    min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  }

  .filter-section {
    ${FilterSection} {
      padding-bottom: ${({ theme }) => theme.spacing.s12};
    }

    &:last-of-type {
      padding-bottom: ${({ theme }) => theme.spacing.s24};
    }
  }

  .button-wrapper {
    position: fixed;
    width: 100%;
    padding: 0 ${({ theme }) => theme.spacing.s24};
    ${({ theme }) => theme.mixin.safeArea('bottom', 24)};
  }
`;
