import React, { useEffect, useRef } from 'react';
import { useLoading } from '@hooks/useLoading';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { PageError } from '@features/exception/components';
import { Layout } from '@features/policy/components';
import { ProviderList } from '../components';
import { usePrivacyProviderService } from '../services';

export const PrivacyProviderContainer: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const { providerList, error, isError, isLoading, isFetching, hasMoreLists, handleLoadDeals } =
    usePrivacyProviderService();
  const headerTriggerRef = useRef<HTMLDivElement>(null);
  /**
   * 로딩바 처리
   */
  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  /** Loading 처리 */
  if (isLoading) {
    return null;
  }

  /** Rendering: error */
  if (isError && providerList.length === 0) {
    return <PageError error={error} />;
  }

  return (
    <Layout title="입점사 목록" headerTriggerRef={headerTriggerRef}>
      <div id="policy-all">
        <div className="layout-box">
          {providerList && (
            <div ref={headerTriggerRef}>
              <InfiniteScroller
                infiniteOptions={{ rootMargin: '50px' }}
                disabled={!hasMoreLists}
                onScrolled={handleLoadDeals}
                loading={isFetching}
              >
                <ProviderList list={providerList} />
              </InfiniteScroller>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
