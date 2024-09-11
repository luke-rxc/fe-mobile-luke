import styled from 'styled-components';
import { AppLinkTypes } from '@constants/link';
import env from '@env';
import { useWebInterface } from '@hooks/useWebInterface';
import { Button } from '@pui/button';
import { getAppLink } from '@utils/link';
import { HTMLAttributes, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import { CALL_WEB_EVENT_TYPE } from '@features/delivery/constants';
import { CALL_WEB_EVENT } from '@features/prizmPay/constants';

const ProtoAuctionInfoEditPage = styled((props: HTMLAttributes<HTMLDivElement>) => {
  const { open, alert, receiveValues } = useWebInterface();

  const handlePayClick = () => {
    const url = getAppLink(AppLinkTypes.WEB, {
      landingType: 'modal',
      url: `${env.endPoint.baseUrl}/mypage/manage-pay`,
    });

    open({ url, initialData: { type: 'onAuctionEntryOpen' } });
  };

  const handleDeliveryClick = () => {
    const url = getAppLink(AppLinkTypes.WEB, {
      landingType: 'modal',
      url: `${env.endPoint.baseUrl}/mypage/manage-delivery`,
    });

    open({ url, initialData: { type: 'onAuctionEntryOpen' } });
  };

  useEffect(() => {
    if (!isEmpty(receiveValues)) {
      const { type } = receiveValues;

      if (type === CALL_WEB_EVENT_TYPE.ON_DELIVERY_CLOSE) {
        alert({ message: '배송지 정보 닫기' });
      }

      if (type === CALL_WEB_EVENT.ON_PAY_CLOSE) {
        alert({ message: '결제 수단 닫기' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  return (
    <div {...props}>
      <h2>경매 입찰 필수 정보 결제수단/배송지 정보</h2>
      <div className="button-wrapper">
        <Button className="action" variant="primary" size="medium" onClick={handlePayClick} block>
          결제 수단
        </Button>
        <Button className="action" variant="primary" size="medium" onClick={handleDeliveryClick} block>
          배송지 정보
        </Button>
      </div>
    </div>
  );
})`
  text-align: center;

  .button-wrapper {
    margin-top: 2.4rem;
    display: flex;
  }
  .action {
    margin: 0 0.5rem;
  }
`;

export default ProtoAuctionInfoEditPage;
