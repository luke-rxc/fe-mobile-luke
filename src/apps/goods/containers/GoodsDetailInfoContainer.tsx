import { useEffect } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useWebInterface } from '@hooks/useWebInterface';
import { TitleSection } from '@pui/titleSection';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { Divider } from '@pui/divider';
import { Conditional } from '@pui/conditional';
import { ListItemText } from '@pui/listItemText';
import { FilterBar, FILTER_BAR_BACKGROUND_CSS_VARIABLE_NAME } from '@features/filter';
import { userAgent } from '@utils/ua';
import { CollapseSub, GoodsError } from '../components';
import { useGoodsDetailInfoService } from '../services';
import { GoodsMessage, GoodsPageName } from '../constants';

interface Props {
  goodsId: string;
  type?: string;
}

export const GoodsDetailInfoContainer = ({ goodsId, type }: Props) => {
  const { query, isOndaDeal, tabList, tabValue, sectionList, scrolling, handleChangeTab } = useGoodsDetailInfoService({
    goodsId: +goodsId,
    type,
  });

  const { data, isFetched, isLoading, isError, error } = query;

  const { isApp } = userAgent();
  const { setTopBar } = useWebInterface();
  const loading = useLoadingSpinner(isLoading);

  // Mweb Header
  useHeaderDispatch({
    type: 'mweb',
    title: GoodsPageName.DETAIL_INFO,
    enabled: isFetched,
    quickMenus: ['cart', 'menu'],
  });

  // App Header
  useEffect(() => {
    setTopBar({
      title: GoodsPageName.DETAIL_INFO,
      backgroundEffectType: 'none',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return null;
  }

  if (isError || !data) {
    return <GoodsError error={error} />;
  }

  if (isEmpty(sectionList)) {
    return <GoodsError description={GoodsMessage.ERROR_NOTHING_LIST} />;
  }

  return (
    <Wrapper>
      {tabList && (
        <Conditional
          condition={isOndaDeal}
          trueExp={
            <div className={classnames('tabs-wrapper', { 'is-app': isApp, 'is-scrolling': scrolling })}>
              <FilterBar
                disabledSticky
                category={{
                  options: tabList,
                  value: tabValue,
                  defaultValue: 0,
                  getValue: (_, index) => index,
                  onChange: handleChangeTab,
                }}
              />
            </div>
          }
          falseExp={<></>}
        />
      )}
      <div className={isOndaDeal ? 'contents-wrapper' : ''}>
        {sectionList &&
          sectionList.map(({ name, items }, index) => {
            const isLastSection = index === sectionList.length - 1;

            return (
              <div key={name}>
                {name && <TitleSection title={name} />}

                {items.map(({ title, contents, contentList }) => (
                  <CollapseSub key={title} title={title} expanded={false}>
                    <Conditional
                      condition={isEmpty(contentList)}
                      trueExp={<div className="info-contents contents-spacing">{contents}</div>}
                      falseExp={
                        <ul className="list-contents contents-spacing">
                          {contentList?.map((content) => (
                            <ListItemText key={content} size="medium" text={content} />
                          ))}
                        </ul>
                      }
                    />
                  </CollapseSub>
                ))}

                {!isLastSection && <Divider t={2.4} b={2.4} />}
              </div>
            );
          })}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing.s24};

  .tabs-wrapper {
    position: fixed;
    ${({ theme }) => theme.mixin.safeArea('top', 56)};
    width: 100%;
    background-color: ${({ theme }) => theme.color.background.surface};
    z-index: 2;
    transform: translateZ(0);

    &.is-app {
      ${({ theme }) => theme.mixin.safeArea('top', 0)};
    }

    &.is-scrolling {
      border-bottom: ${({ theme }) => `0.05rem solid ${theme.color.backgroundLayout.line}`};
    }
  }

  ${FilterBar} {
    ${FILTER_BAR_BACKGROUND_CSS_VARIABLE_NAME}: ${({ theme }) => theme.color.background.surface};
  }

  .contents-wrapper {
    margin-top: 5.6rem;
  }

  .contents-spacing {
    padding: ${({ theme }) => `${theme.spacing.s8} ${theme.spacing.s24} ${theme.spacing.s24}`};
  }

  .info-contents {
    position: relative;
    color: ${({ theme }) => theme.color.text.textPrimary};
    font: ${({ theme }) => theme.fontType.medium};
    word-break: keep-all;
    white-space: pre-wrap;
  }

  .list-contents {
    padding-left: 0;
    padding-right: 0;
  }
`;
