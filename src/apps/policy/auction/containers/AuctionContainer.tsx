import { useRef } from 'react';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Layout } from '@features/policy/components';

export const AuctionContainer = () => {
  const { isApp } = useDeviceDetect();
  const headerTriggerRef = useRef<HTMLDivElement>(null);
  return (
    <Layout className={isApp ? 'app' : ''} title="경매약관" headerTriggerRef={headerTriggerRef}>
      <div id="policy-all">
        {!isApp && <h1>경매약관</h1>}
        <article ref={headerTriggerRef}>
          <div className="layout-box">
            <p className="layout-text">
              (주)알엑스씨(이하 “회사”)는 PRIZM 서비스(이하 “몰”)에서 온라인 경매 서비스를 제공하고 있습니다. 아래
              내용은 서비스 이용약관의 제27조 (온라인 경매 서비스)에 고지된 내용 전문을 발췌하여 구성되었습니다.
            </p>
          </div>
        </article>
        <article>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  “몰”에서 제공하는 경매 서비스는 라이브 방송 중 경매 기능으로 제공되며 향후 경매 서비스의 종류와 내용은
                  변경될 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  “몰’에 로그인한 회원이라면 누구나 경매 서비스를 이용할 수 있습니다. 단, “몰”에 의해 회원 자격에 제한을
                  받았거나 정지된 경우 경매 서비스 이용이 제한될 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">회원은 회사가 제공하는 방식으로만 입찰에 참여할 수 있습니다.</p>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  경매 중 단위 입찰금액의 조정은 “몰”의 운영 방식에 따르며 생방송 호스트의 안내 멘트, 메시지 또는 서비스
                  내 입찰 화면을 통해 고지됩니다.
                </p>
              </li>
              <li>
                <span className="mark">5.</span>
                <p className="layout-text">
                  입찰 참여는 취소가 불가능합니다. 회원이 입찰에 참여하는 하는 행위는 입찰 취소 불가 정책에 동의한
                  것으로 간주합니다.
                </p>
              </li>
              <li>
                <span className="mark">6.</span>
                <p className="layout-text">
                  회사는 회사의 단독적이고 절대적인 재량에 따라 다음의 사항을 실시할 수 있습니다.
                </p>
                <ol className="lst-indent">
                  <li>
                    <span className="mark">①</span>
                    <p className="layout-text">예정된 경매에 대한 취소 또는 경매 일시 변경</p>
                  </li>
                  <li>
                    <span className="mark">②</span>
                    <p className="layout-text">진행중인 경매에 대한 중도 철회</p>
                  </li>
                  <li>
                    <span className="mark">③</span>
                    <p className="layout-text">진행중인 경매에 대한 입찰 마감 카운트다운 또는 낙찰 처리</p>
                  </li>
                  <li>
                    <span className="mark">④</span>
                    <p className="layout-text">유찰 또는 낙찰 후 결제 거부 등의 사유로 재경매 진행</p>
                  </li>
                </ol>
              </li>
              <li>
                <span className="mark">7.</span>
                <p className="layout-text">
                  회원이 사전에 등록된 PRIZM 간편 결제 카드로 즉시 결제되는 조건의 경매에 입찰하여 낙찰될 경우,
                  낙찰금액은 낙찰된 회원의 PRIZM 간편 결제 카드로 즉시 결제될 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">8.</span>
                <p className="layout-text">
                  회사는 낙찰된 회원에게 결제해야 하는 낙찰 상품 및 낙찰가, 구매 제한 시간을 앱푸시 메시지, 알림함
                  메시지 등의 가용한 방법으로 고지합니다.
                </p>
              </li>
              <li>
                <span className="mark">9.</span>
                <p className="layout-text">
                  회사는 낙찰된 회원이 낙찰 취소 및 포기 의사를 보일 시 낙찰 금액의 10%를 낙찰 철회 수수료로 청구할 수
                  있습니다. 또한 향후 경매 참여나 서비스 이용을 제한할 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">10.</span>
                <p className="layout-text">
                  청약 철회가 불가능한 상품의 경매는 상품 정보 및 경매 진행 안내 시 사전에 고지되며 입찰에 참여하는 것은
                  이에 대해 동의하는 것으로 간주합니다.
                </p>
              </li>
              <li>
                <span className="mark">11.</span>
                <p className="layout-text">
                  낙찰된 회원은 안내된 결제 가능 시간 내에 낙찰 상품을 결제해야 합니다. 안내된 결제 가능 시간이 지나면
                  회사는 회원이 낙찰을 포기하는 것으로 간주하고 낙찰 포기에 따른 낙찰 철회 수수료를 청구할 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">12.</span>
                <p className="layout-text">
                  경매 상품은 결제 시 할인 쿠폰이나 적립금을 사용할 수 없으며 결제 금액에 따른 적립금 지급 또한 제공되지
                  않습니다.
                </p>
              </li>
              <li>
                <span className="mark">13.</span>
                <p className="layout-text">
                  경매 상품은 상품의 종류와 낙찰 가격에 따라 별도의 배송 방법을 제공할 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">14.</span>
                <p className="layout-text">
                  경매 상품의 배송 도중 발생한 파손 및 분실에 대해서는 배송 업체가 제공하는 피해 보상 한도 내에서
                  보상받을 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">15.</span>
                <p className="layout-text">
                  회사는 경매 서비스의 원활한 운영과 신뢰성을 위하여 회원 자격을 정지하거나 경매 서비스의 이용 제한 및
                  기타 조치를 취할 수 있습니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
      </div>
    </Layout>
  );
};
