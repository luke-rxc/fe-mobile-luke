import React, { ReactNode, useEffect, useState } from 'react';

import { ViewStatusType } from '../constants';
import { useDelayUnmount } from '../hooks';

interface Props {
  viewType: ViewStatusType;
  children: ReactNode;
}

export const ViewToggle = React.memo(({ viewType, children }: Props) => {
  const [viewStatus, setViewStatus] = useState<ViewStatusType>(viewType);
  const shouldRenderChild = useDelayUnmount(
    viewStatus === ViewStatusType.SHOW,
    1500,
    viewStatus === ViewStatusType.HIDE,
  );
  useEffect(() => {
    viewType !== viewStatus && setViewStatus(viewType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewType]);

  return shouldRenderChild ? <div>{children}</div> : null;
});
