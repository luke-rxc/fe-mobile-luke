import { useRef } from 'react';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Layout } from '@features/policy/components';

export const BenefitContainer = () => {
  const { isApp } = useDeviceDetect();
  const headerTriggerRef = useRef<HTMLDivElement>(null);
  return (
    <Layout className={isApp ? 'app' : ''} title="마케팅 정보 수신동의" headerTriggerRef={headerTriggerRef}>
      <div id="policy-all">
        {!isApp && <h1>혜택 및 이벤트 알림 수신 동의 약관</h1>}
        <article ref={headerTriggerRef}>
          <h2 className="first">광고성 정보 수신 동의 안내</h2>
          <div className="layout-box">
            <p className="layout-text">
              (주)알엑스씨는 개인정보의 수집 및 이용에 동의하신 회원님을 대상으로 문자메시지, 푸시 알림 등 다양한 전자적
              전송 매체를 이용해 광고성 정보를 전송 할 수 있습니다. 다만, 동의하지 않을 경우 관련 편의제공 등 이용
              목적에 따른 혜택에 제한이 있을 수 있습니다.
            </p>
            <p className="layout-text">
              {`광고성 정보 수신에 대한 동의 및 철회는 PRIZM 앱 > 마이페이지 > 설정 > 알림 > 알림 설정 에서 언제든지 가능합니다.`}
            </p>
          </div>
          <div className="layout-table layout-box">
            <div className="table-box">
              <table className="table row-style benefit">
                <colgroup>
                  <col width="120px" />
                  <col width="auto" />
                </colgroup>
                <tbody>
                  <tr>
                    <td>처리 목적</td>
                    <td>프리즘에서 제공하는 상품이나 서비스에 대한 광고/홍보/프로모션 제공</td>
                  </tr>
                  <tr>
                    <td>처리 항목</td>
                    <td>
                      이메일 주소, 회원 닉네임, 고객 식별 번호(ID), 서비스 접속 일시, 단말식별번호(단말기 아이디),
                      PUSH토큰
                    </td>
                  </tr>
                  <tr>
                    <td>이용 및 보유기간</td>
                    <td>
                      <span>동의 철회 시 또는 회원 탈퇴 시까지</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="layout-box">
            <p className="layout-text">
              광고성 정보 수신에 동의하시는 경우 1년마다 광고성 정보 수신 동의 상태를 알려드립니다.
            </p>
          </div>
        </article>
      </div>
    </Layout>
  );
};
