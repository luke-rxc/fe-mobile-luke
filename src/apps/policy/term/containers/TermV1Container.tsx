import { ChangeEvent, useRef } from 'react';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Layout } from '@features/policy/components';
import { Option, Select } from '@pui/select';
import { useTermService } from '../services';

export const TermV1Container = () => {
  const { isApp } = useDeviceDetect();
  const headerTriggerRef = useRef<HTMLDivElement>(null);
  const { handleGetVersionList, handleAnchor } = useTermService();
  const values = handleGetVersionList();
  const handleSelect = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    handleAnchor(target?.value);
  };
  return (
    <Layout className={isApp ? 'app' : ''} title="이용약관" headerTriggerRef={headerTriggerRef}>
      <div id="policy-all">
        {!isApp && <h1>이용 약관</h1>}
        <article ref={headerTriggerRef}>
          <h2 className="first">제1조 (목적)</h2>
          <div className="layout-box">
            <p className="layout-text">
              {`이 약관은 (주)알엑스씨(이하 “회사")가 운영하는 PRIZM(프리즘) 서비스(이하 “서비스")를 이용함에 있어 회사와
            이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.`}
            </p>
            <p className="layout-text">
              ※ 「PC통신, 무선 등을 이용하는 전자상거래에 대해서도 그 성질에 반하지 않는 한 이 약관을 준용합니다.」
            </p>
          </div>
        </article>
        <article>
          <h2>제2조 (정의)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  “몰”이란 회사가 재화 또는 용역(이하 “재화 등”이라 함)을 이용자 에게 제공하기 위하여 컴퓨터 등
                  정보통신설비를 이용하여 재화 등을 거래 할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이버몰을
                  운영하는 사업자의 의미로도 사용합니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  “이용자”란 “몰”에 접속하여 이 약관에 따라 “몰”이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  ‘회원’이라 함은 “몰”에 회원등록을 한 자로서, 계속적으로 “몰”이 제공하는 서비스를 이용할 수 있는 자를
                  말합니다.
                </p>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  ‘비회원’이라 함은 회원에 가입하지 않고 “몰”이 제공하는 서비스를 이용하는 자를 말합니다.
                </p>
              </li>
              <li>
                <span className="mark">5.</span>
                <p className="layout-text">
                  “PRIZM 간편 결제”란 회원이 자신의 결제수단과 관련된 정보를 매번 입력할 필요 없이 관련 정보의 등록 후
                  비밀번호 입력만을 통해 상품 결제가 가능한 서비스를 말합니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제3조 (약관 등의 명시와 설명 및 개정)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  회사는 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소(소비 자의 불만을 처리할 수 있는 곳의
                  주소를 포함), 전화번호, 모사전송번호, 전자우편 주소, 사업자등록번호, 통신판매업 신고번호,
                  개인정보관리책임자 등을 이용자가 쉽게 알 수 있도록 몰의 초기 서비스화면(전면)에 게시합니다. 다만,
                  약관의 내용은 이용자가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  회사는 이용자가 약관에 동의하기에 앞서 약관에 정하여져 있는 내용 중 청약철회, 배송책임, 환불조건 등과
                  같은 중요한 내용을 이용자가 이해할 수 있 도록 별도의 연결화면 또는 팝업화면 등을 제공하여 이용자의
                  확인을 구하여야 합니다.
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  회사는 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」, 「정보통신망
                  이용촉진 및 정보보호 등에 관한 법률」, 「소비자기본법」 등 관련 법을 위배하지 않는 범위에서 이 약관을
                  개정할 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약 관과 함께 몰의 초기화면에 그
                  적용일자 7일 이전부터 적용일자 전일까지 공지합니다. 다만, 이용자에게 불리하게 약관내용을 변경하는
                  경우에는 최소 한 30일 이상의 사전 유예기간을 두고 공지합니다. 이 경우 회사는 개정 전 내용과 개정 후
                  내용을 명확하게 비교하여 이용자가 알기 쉽도록 표시합니다.
                </p>
              </li>
              <li>
                <span className="mark">5.</span>
                <p className="layout-text">
                  회사가 약관을 개정할 경우에는 그 개정약관은 그 적용일자 이후에 체결 되는 계약에만 적용되고 그 이전에
                  이미 체결된 계약에 대해서는 개정 전의 약관조항이 그대로 적용됩니다. 다만 이미 계약을 체결한 이용자가
                  개정약 관 조항의 적용을 받기를 원하는 뜻을 제5항에 의한 개정약관의 공지기간 내에 회사에 송신하여
                  회사의의 동의를 받은 경우에는 개정약관 조항이 적용됩니다.
                </p>
              </li>
              <li>
                <span className="mark">6.</span>
                <p className="layout-text">
                  이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 전자상거래 등에서의 소비자보호에 관한 법률,
                  약관의 규제 등에 관한 법률, 공정거래위 원회가 정하는 전자상거래 등에서의 소비자 보호지침 및 관계법령
                  또는 상 관례에 따릅니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제4조 (서비스의 제공 및 변경)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">회사는 다음과 같은 서비스를 제공합니다. </p>
                <ol className="lst-indent">
                  <li>
                    <span className="mark">①</span>
                    <p className="layout-text">재화 또는 용역에 대한 정보 제공 및 구매계약의 체결</p>
                  </li>
                  <li>
                    <span className="mark">②</span>
                    <p className="layout-text">구매계약이 체결된 재화 또는 용역의 배송</p>
                  </li>
                  <li>
                    <span className="mark">③</span>
                    <p className="layout-text">기타 회사가 정하는 업무</p>
                  </li>
                </ol>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  “회사”는 재화 또는 용역의 품절 또는 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 제공할
                  재화 또는 용역의 내용을 변경할 수 있습니다. 이 경우에는 변경된 재화 또는 용역의 내용 및 제공일자를
                  명시하여 현재의 재화 또는 용역의 내용을 게시한 곳에 즉시 공지합니다.
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  “회사”가 제공하기로 이용자와 계약을 체결한 서비스의 내용을 재화등의 품절 또는 기술적 사양의 변경 등의
                  사유로 변경할 경우에는 그 사유를 이용 자에게 통지 가능한 주소로 즉시 통지합니다.
                </p>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  전항의 경우 “회사”는 이로 인하여 이용자가 입은 손해를 배상합니다. 다만, “회사”가 고의 또는 과실이
                  없음을 입증하는 경우에는 그러하지 아니합니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제5조 (서비스의 중단)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  “회사”는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등 의 사유가 발생한 경우에는
                  서비스의 제공을 일시적으로 중단할 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  “회사”는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에
                  대하여 배상합니다. 단, “회사”의 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  사업종목의 전환, 사업의 포기, 업체 간의 통합 등의 이유로 서비스를 제공 할 수 없게 되는 경우에는 회사는
                  제8조에 정한 방법으로 이용자에게 통지하고 당초 회사에서 제시한 조건에 따라 소비자에게 보상합니다.
                  다만, 회사가 보상기준 등을 고지하지 아니한 경우에는 이용자들의 마일리지 또 는 적립금 등을 “몰”에서
                  통용되는 통화가치에 상응하는 현물 또는 현금 으로 이용자에게 지급합니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제6조 (회원가입)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  이용자는 “몰”이 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서
                  회원가입을 신청합니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  “몰”은 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호 에 해당하지 않는 한 회원으로
                  등록합니다.
                </p>
                <ol className="lst-indent">
                  <li>
                    <span className="mark">①</span>
                    <p className="layout-text">
                      가입신청자가 이 약관 제7조 제3항에 의하여 이전에 회원자격을 상실한 적 이 있는 경우, 다만 제7조
                      제3항에 의한 회원자격 상실 후 3년이 경과한 자 로서 “몰”의 회원 재가입 승낙을 얻은 경우에는 예외로
                      한다.
                    </p>
                  </li>
                  <li>
                    <span className="mark">②</span>
                    <p className="layout-text">등록 내용에 허위, 기재누락, 오기가 있는 경우</p>
                  </li>
                  <li>
                    <span className="mark">③</span>
                    <p className="layout-text">
                      기타 회원으로 등록하는 것이 “몰”의 기술상 현저히 지장이 있다고 판단되는 경우
                    </p>
                  </li>
                  <li>
                    <span className="mark">④</span>
                    <p className="layout-text">만 14세 미만 아동이 법정대리인의 동의 없이 가입한 것으로 확인된 경우</p>
                  </li>
                </ol>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">회원가입계약의 성립 시기는 “몰”의 승낙이 회원에게 도달한 시점으로 합니다.</p>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  회원은 회원가입 시 등록한 사항에 변경이 있는 경우, 상당한 기간 이내에 “몰”에 대하여 회원정보 수정 등의
                  방법으로 그 변경사항을 알려야 합니다.
                </p>
              </li>
              <li>
                <span className="mark">5.</span>
                <p className="layout-text">
                  회사는 회원 가입 시 이용자로부터 상품 정보 및 이벤트와 관련된 광고성 앱푸시 메시지 수신, 재화나
                  서비스를 홍보하거나 판매를 권유하기 위한 개인정보 처리에 대한 동의를 받을 수 있고, 그러한 동의를 받은
                  경우에는 해당 서비스를 제공할 수 있습니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제7조 (회원 탈퇴 및 자격 상실 등)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  회원은 “몰”에 언제든지 탈퇴를 요청할 수 있으며 “몰”은 즉시 회원탈퇴를 처리합니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  회원이 다음 각 호의 사유에 해당하는 경우, “몰”은 회원자격을 제한 및 정지시킬 수 있습니다.
                </p>
                <ol className="lst-indent">
                  <li>
                    <span className="mark">①</span>
                    <p className="layout-text">가입 신청 시에 허위 내용을 등록한 경우</p>
                  </li>
                  <li>
                    <span className="mark">②</span>
                    <p className="layout-text">
                      “몰”을 이용하여 구입한 재화 등의 대금, 기타 “몰” 이용에 관련하여 회원이 부담하는 채무를 기일에
                      지급하지 않는 경우
                    </p>
                  </li>
                  <li>
                    <span className="mark">③</span>
                    <p className="layout-text">
                      다른 사람의 “몰” 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우
                    </p>
                  </li>
                  <li>
                    <span className="mark">④</span>
                    <p className="layout-text">
                      “몰”을 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행 위를 하는 경우
                    </p>
                  </li>
                  <li>
                    <span className="mark">⑤</span>
                    <p className="layout-text">기타 “몰”의 서비스 운영을 고의로 방해하는 행위를 하는 경우</p>
                  </li>
                </ol>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  “몰”이 회원 자격을 제한, 정지시킨 후, 동일한 행위가 2회 이상 반복되거나 30일 이내에 그 사유가 시정되지
                  아니하는 경우 “몰”은 회원 자격을 상실시킬 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  “몰”이 회원 자격을 상실시키는 경우에는 회원 등록을 말소합니다. 이 경우 회원에게 이를 통지하고, 회원
                  등록 말소 전에 최소한 30일 이상의 기간을 정하여 소명할 기회를 부여합니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제8조 (회원에 대한 통지)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  “몰”이 회원에 대한 통지를 하는 경우, 회원이 “몰”과 미리 약정하여 지정한 전자우편 주소 또는
                  휴대폰번호로 할 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  “몰”은 불특정 다수 회원에 대한 통지의 경우 1주일이상 “몰” 게시판에 게시함으로서 개별 통지에 갈음할 수
                  있습니다. 다만, 회원 본인의 거래와 관련하여 중대한 영향을 미치는 사항에 대하여는 개별통지를 합니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제9조 (구매신청 및 개인정보 제공 동의 등)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  “몰” 이용자는 “몰”상에서 다음 또는 이와 유사한 방법에 의하여 구매를 신청하며, “몰”은 이용자가
                  구매신청을 함에 있어서 다음의 각 내용을 알기 쉽게 제공하여야 합니다.
                </p>
                <ol className="lst-indent">
                  <li>
                    <span className="mark">①</span>
                    <p className="layout-text">재화 등의 검색 및 선택</p>
                  </li>
                  <li>
                    <span className="mark">②</span>
                    <p className="layout-text">성명, 주소, 전화번호(또는 휴대폰번호), 전자우편 주소 등의 입력</p>
                  </li>
                  <li>
                    <span className="mark">③</span>
                    <p className="layout-text">
                      약관 내용, 청약 철회권이 제한되는 서비스, 배송료, 설치비 등의 비용부담과 관련한 내용에 대한 확인
                    </p>
                  </li>
                  <li>
                    <span className="mark">④</span>
                    <p className="layout-text">
                      이 약관에 동의하고 위 3호의 사항을 확인하거나 거부하는 표시 (예, 마우스 클릭)
                    </p>
                  </li>
                  <li>
                    <span className="mark">⑤</span>
                    <p className="layout-text">재화 등의 구매신청 및 이에 관한 확인 또는 “몰”의 확인에 대한 동의</p>
                  </li>
                  <li>
                    <span className="mark">⑥</span>
                    <p className="layout-text">결제방법의 선택</p>
                  </li>
                </ol>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  {`회사는 제3자에게 구매자 개인정보를 제공할 필요가 있는 경우 1) 개인정보를 제공받는 자, 2) 개인정보를 제공받는
            자의 개인정보 이용목적, 3) 제공하는 개인정보의 항목, 4) 개인정보를 제공받는 자의 개인정보 보유 및 이용기간을
            구매자에게 알리고 동의를 받아야 합니다. (동의를 받은 사항이 변경되는 경우에도 같습니다).`}
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  {`회사가 제3자에게 구매자의 개인정보를 취급할 수 있도록 업무를 위탁하는 경우에는 1) 개인정보 취급위탁을 받는
            자, 2) 개인정보 취급위탁을 하는 업무의 내용을 구매자가 언제든지 쉽게 확인할 수 있도록 개인정보보호법 등 관련
            법령이 정하는 방법에 따라 공개하여야 합니다.`}
                </p>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  {`회사는 국외의 제3자에게 구매자 개인정보를 이전할 필요가 있는 경우 1) 이전되는 개인정보의 항목, 2) 개인정보가
            이전되는 국가, 이전 일시 및 이전방법, 3) 개인정보를 이전 받는 자의 성명(법인인 경우 그 명칭 및
            정보관리책임자의 연락처), 4) 개인정보를 이전 받는 자의 개인정보 이용목적 및 보유 이용기간을 구매자에게
            알리고 동의를 받아야 합니다. (동의를 받은 사항이 변경되는 경우에도 같습니다.)`}
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제10조 (계약의 성립)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  “몰”은 제9조와 같은 구매신청에 대하여 다음 각 호에 해당하면 승낙하지 않을 수 있습니다.
                </p>
                <ol className="lst-indent">
                  <li>
                    <span className="mark">①</span>
                    <p className="layout-text">신청 내용에 허위, 기재누락, 오기가 있는 경우</p>
                  </li>
                  <li>
                    <span className="mark">②</span>
                    <p className="layout-text">
                      미성년자가 담배, 주류 등 청소년보호법에서 금지하는 재화 및 용역을 구매하는 경우
                    </p>
                  </li>
                  <li>
                    <span className="mark">③</span>
                    <p className="layout-text">
                      기타 구매신청에 승낙하는 것이 “몰” 기술상 현저히 지장이 있다고 판단하는 경우
                    </p>
                  </li>
                </ol>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  “몰”의 승낙이 제12조 제1항의 수신확인 통지형태로 이용자에게 도달한 시점에 계약이 성립한 것으로 봅니다.
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  “몰”의 승낙의 의사표시에는 이용자의 구매 신청에 대한 확인 및 판매가능 여부, 구매신청의 정정 취소 등에
                  관한 정보 등을 포함하여야 합니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제11조 (지급방법)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  “몰”에서 구매한 재화 또는 용역에 대한 대금 지급 방법은 다음 각 호의 방법 중 가용한 방법으로 할 수
                  있습니다. 단, “몰”은 이용자의 지급 방법에 대하여 재화 등의 대금에 어떠한 명목의 수수료도 추가하여
                  징수할 수 없습니다.
                </p>
                <ol className="lst-indent">
                  <li>
                    <span className="mark">①</span>
                    <p className="layout-text">선불카드, 직불카드, 신용카드 등의 각종 카드 결제</p>
                  </li>
                  <li>
                    <span className="mark">②</span>
                    <p className="layout-text">전자화폐 기타 전자적 지급 방법에 의한 결제</p>
                  </li>
                  <li>
                    <span className="mark">③</span>
                    <p className="layout-text">마일리지 등 “몰”이 지급한 포인트에 의한 결제</p>
                  </li>
                  <li>
                    <span className="mark">④</span>
                    <p className="layout-text">“몰”과 계약을 맺었거나 “몰”이 인정한 상품권에 의한 결제</p>
                  </li>
                  <li>
                    <span className="mark">⑤</span>
                    <p className="layout-text">기타 회사가 추가 지정하는 결제수단</p>
                  </li>
                </ol>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제12조 (수신확인통지, 구매신청 변경 및 취소)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">“몰”은 이용자의 구매신청이 있는 경우 이용자에게 수신확인통지를 합니다.</p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  수신확인통지를 받은 이용자는 의사표시의 불일치 등이 있는 경우에는 수신확인통지를 받은 후 즉시 구매신청
                  변경 및 취소를 요청할 수 있고, “몰” 은 배송 전에 이용자의 요청이 있는 경우에는 지체 없이 그 요청에
                  따라 처리하여야 합니다. 다만 이미 대금을 지불한 경우에는 제15조의 청약철회 등에 관한 규정에 따릅니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제13조(재화 등의 공급)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  “몰”은 이용자와 재화 등의 공급시기에 관하여 별도의 약정이 없는 이상, 이용자가 청약을 한 날부터 7일
                  이내에 재화 등을 배송할 수 있도록 주문제작, 포장 등 기타의 필요한 조치를 취합니다. 다만, “몰”이 이미
                  재화 등의 대금의 전부 또는 일부를 받은 경우에는 대금의 전부 또는 일부를 받은 날부터 3영업일 이내에
                  조치를 취합니다. 이때 “몰”은 이용자가 재화 등의 공급 절차 및 진행 사항을 확인할 수 있도록 적절한
                  조치를 합니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  “몰”은 이용자가 구매한 재화에 대해 배송수단, 수단별 배송비용 부담자, 수단별 배송기간 등을 명시합니다.
                  만약 “몰”이 약정 배송기간을 초과한 경우에는 그로 인한 이용자의 손해를 배상하여야 합니다. 다만 “몰”이
                  고의, 과실이 없음을 입증한 경우에는 그러하지 아니합니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제14조 (환급)</h2>
          <div className="layout-box">
            <p className="layout-text">
              “몰”은 이용자가 구매 신청한 재화 등이 품절 등의 사유로 인도 또는 제공을 할 수 없을 때에는 지체 없이 그
              사유를 이용자에게 통지하고 사전에 재화 등의 대금을 받은 경우에는 대금을 받은 날부터 3영업일 이내에
              환급하거나 환급에 필요한 조치를 취합니다.
            </p>
          </div>
        </article>
        <article>
          <h2>제15조 (청약 철회 등)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  “몰”과 재화 등의 구매에 관한 계약을 체결한 이용자는 「전자상거래 등에서의 소비자보호에 관한 법률」
                  제13조 제2항에 따른 계약내용에 관한 서면을 받은 날(그 서면을 받은 때보다 재화 등의 공급이 늦게
                  이루어진 경우에는 재화 등을 공급받거나 재화 등의 공급이 시작된 날을 말합니다)부터 7일 이내에는 청약의
                  철회를 할 수 있습니다. 다만, 청약철회에 관하여 「전자상거래 등에서의 소비자 보호에 관한 법률」에 달리
                  정함이 있는 경우에는 동 법 규정에 따릅니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  이용자는 재화 등을 배송 받은 경우 다음 각 호의 1에 해당하는 경우에는 반품 및 교환을 할 수 없습니다.
                </p>
                <ol className="lst-indent">
                  <li>
                    <span className="mark">①</span>
                    <p className="layout-text">
                      이용자에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우(다만, 재화 등의 내용을 확인하기 위하여
                      포장 등을 훼손한 경우에는 청약철회를 할 수 있습니다)
                    </p>
                  </li>
                  <li>
                    <span className="mark">②</span>
                    <p className="layout-text">
                      이용자의 사용 또는 일부 소비에 의하여 재화 등의 가치가 현저히 감소한 경우
                    </p>
                  </li>
                  <li>
                    <span className="mark">③</span>
                    <p className="layout-text">
                      시간의 경과에 의하여 재판매가 곤란할 정도로 재화 등의 가치가 현저히 감소한 경우
                    </p>
                  </li>
                  <li>
                    <span className="mark">④</span>
                    <p className="layout-text">
                      같은 성능을 지닌 재화 등으로 복제가 가능한 경우 그 원본인 재화 등의 포장을 훼손한 경우
                    </p>
                  </li>
                  <li>
                    <span className="mark">⑤</span>
                    <p className="layout-text">
                      용역 또는 문화산업진흥 기본법 제2조 제5호의 디지털콘텐츠의 제공이 개시된 경우 (다만 가분적 용역 및
                      가분적 디지털콘텐츠로 구성된 계약의 경우에는 제공이 개시되지 아니한 부분에 대하여는 그러하지
                      아니한다)
                    </p>
                  </li>
                  <li>
                    <span className="mark">⑥</span>
                    <p className="layout-text">
                      주문에 따라 개별적으로 생산되는 물품 등 사전에 해당 거래에 대하여 별도로 고지하고 이용자의
                      서면(전자문서포함)동의를 받은 경우
                    </p>
                  </li>
                </ol>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  제2항 제2호 내지 제4호의 경우에 “몰”이 사전에 청약 철회 등이 제한되는 사실을 소비자가 쉽게 알 수 있는
                  곳에 명기하거나 시용 상품을 제공하는 등의 조치를 하지 않았다면 이용자의 청약 철회 등이 제한되지
                  않습니다.
                </p>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  이용자는 제1항 및 제2항의 규정에 불구하고 재화 등의 내용이 표시, 광고 내용과 다르거나 계약 내용과
                  다르게 이행된 때에는 당해 재화 등을 공급받은 날부터 3월 이내, 그 사실을 안 날 또는 알 수 있었던 날부터
                  30일 이내에 청약 철회 등을 할 수 있습니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제16조 (청약 철회 등의 효과)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  “몰”은 이용자로부터 재화 등을 반환 받은 경우 3영업일 이내에 이미 지급받은 재화 등의 대금을 환급합니다.
                  이 경우 “몰”이 이용자에게 재화 등의 환급을 지연한 때에는 그 지연 기간에 대하여 「전자상거래 등에서의
                  소비자보호에 관한 법률 시행령」 제21조의 3에서 정하는 지연이자율을 곱하여 산정한 지연이자를
                  지급합니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  “몰”은 위 대금을 환급함에 있어서 이용자가 신용카드 또는 전자화폐 등의 결제수단으로 재화 등의 대금을
                  지급한 때에는 지체 없이 당해 결제수단을 제공한 사업자로 하여금 재화 등의 대금의 청구를 정지 또는
                  취소하도록 요청합니다.
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  청약 철회 등의 경우 공급받은 재화 등의 반환에 필요한 비용은 이용자가 부담합니다. “몰”은 이용자에게
                  청약철회 등을 이유로 위약금 또는 손해배상을 청구하지 않습니다. 다만 재화 등의 내용이 표시, 광고 내용과
                  다르거나 계약 내용과 다르게 이행되어 청약 철회 등을 하는 경우 재화 등의 반환에 필요한 비용은 “몰”이
                  부담합니다.
                </p>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  이용자가 상품을 구매하여 적립금을 지급받은 후 이용자가 청약 철회를 하는 경우 회사는 해당 상품 구매로
                  인해 이용자에게 부여된 적립금을 회수합니다.
                </p>
              </li>
              <li>
                <span className="mark">5.</span>
                <p className="layout-text">
                  이용자가 재화 등을 제공받을 때 발송비를 부담한 경우에 “몰”은 청약철회 시 그 비용을 누가 부담하는지를
                  이용자가 알기 쉽도록 명확하게 표시합니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제17조 (개인정보보호)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  “몰”은 이용자의 개인정보 수집 시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  “몰”은 회원가입 시 구매계약이행에 필요한 정보를 미리 수집하지 않습니다. 다만, 관련 법령상 의무이행을
                  위하여 구매계약 이전에 본인확인이 필요 한 경우로서 최소한의 특정 개인정보를 수집하는 경우에는 그러하지
                  아니합니다.
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  “몰”은 이용자의 개인정보를 수집, 이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.
                </p>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  “몰”은 수집된 개인정보를 목적 외의 용도로 이용할 수 없으며, 새로운 이용목적이 발생한 경우 또는
                  제3자에게 제공하는 경우에는 이용, 제공단계에서 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.
                  다만, 관련 법령에 달리 정함이 있는 경우에는 예외로 합니다.
                </p>
              </li>
              <li>
                <span className="mark">5.</span>
                <p className="layout-text">
                  “몰”이 제2항과 제3항에 의해 이용자의 동의를 받아야 하는 경우에는 개인정보관리 책임자의 신원(소속, 성명
                  및 전화번호, 기타 연락처), 정보의 수집목적 및 이용목적, 제3자에 대한 정보제공 관련사항(제공받은 자,
                  제공목적 및 제공할 정보의 내용) 등 「개인정보보호법」 제15조 제2항이 규정한 사항을 미리 명시하거나
                  고지해야 하며 이용자는 언제든지 이 동의를 철회할 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">6.</span>
                <p className="layout-text">
                  이용자는 언제든지 “몰”이 가지고 있는 자신의 개인정보에 대해 열람 및 오류 정정을 요구할 수 있으며
                  “몰”은 이에 대해 지체 없이 필요한 조치를 취할 의무를 집니다. 이용자가 오류의 정정을 요구한 경우에는
                  “몰”은 그 오류를 정정할 때까지 당해 개인정보를 이용하지 않습니다.
                </p>
              </li>
              <li>
                <span className="mark">7.</span>
                <p className="layout-text">
                  “몰”은 개인정보 보호를 위하여 이용자의 개인정보를 취급하는 자를 최소한으로 제한하여야 하며 신용카드,
                  은행계좌 등을 포함한 이용자의 개인정보의 분실, 도난, 유출, 동의 없는 제3자 제공, 변조 등으로 인한
                  이용자의 손해에 대하여 모든 책임을 집니다.
                </p>
              </li>
              <li>
                <span className="mark">8.</span>
                <p className="layout-text">
                  “몰” 또는 그로부터 개인정보를 제공받은 제3자는 개인정보의 수집목적 또는 제공받은 목적을 달성한 때에는
                  당해 개인정보를 지체 없이 파기합니다.
                </p>
              </li>
              <li>
                <span className="mark">9.</span>
                <p className="layout-text">
                  “몰”은 개인정보의 수집, 이용, 제공에 관한 동의란을 미리 선택한 것으로 설정해두지 않습니다. 또한
                  개인정보의 수집, 이용, 제공에 관한 이용자의 동의거절시 제한되는 서비스를 구체적으로 명시하고,
                  필수수집항목이 아닌 개인정보의 수집, 이용, 제공에 관한 이용자의 동의 거절을 이유로 회원가입 등 서비스
                  제공을 제한하거나 거절하지 않습니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제18조 (“몰“의 의무)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  “몰”은 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라
                  지속적이고, 안정적으로 재화, 용역을 제공하는데 최선을 다하여야 합니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  “몰”은 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보(신용정보 포함)보호를 위한
                  보안 시스템을 갖추어야 합니다.
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  “몰”이 상품이나 용역에 대하여 「표시,광고의 공정화에 관한 법률」 제3 조 소정의 부당한 표시,광고행위를
                  함으로써 이용자가 손해를 입은 때에는 이를 배상할 책임을 집니다.
                </p>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  “몰”은 이용자가 수신거절 의사를 명백히 표시한 경우 영리목적의 광고성 전자우편을 발송하지 않습니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제19조 (회원의 계정에 대한 의무)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">제17조의 경우를 제외한 ID와 비밀번호에 관한 관리책임은 회원에게 있습니다.</p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">회원은 자신의 ID 및 비밀번호를 제3자에게 이용하게 해서는 안됩니다.</p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  회원이 자신의 ID 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 바로 “몰”에
                  통보하고 “몰”의 안내가 있는 경우에는 그에 따라야 합니다.
                </p>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  “회사”는 회사의 과실없이 회원이 상기 제1항, 제2항, 제3항을 위반하여 회원에게 발생한 손해에 대하여
                  아무런 책임을 부담하지 않습니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제20조 (이용자의 의무)</h2>
          <div className="layout-box">
            <p className="layout-text">이용자는 다음 행위를 하여서는 안됩니다.</p>
            <ol className="lst-indent">
              <li>
                <span className="mark">①</span>
                <p className="layout-text">신청 또는 변경시 허위 내용의 등록</p>
              </li>
              <li>
                <span className="mark">②</span>
                <p className="layout-text">타인의 정보 도용</p>
              </li>
              <li>
                <span className="mark">③</span>
                <p className="layout-text">“몰”에 게시된 정보의 변경</p>
              </li>
              <li>
                <span className="mark">④</span>
                <p className="layout-text">“몰”이 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</p>
              </li>
              <li>
                <span className="mark">⑤</span>
                <p className="layout-text">“몰” 기타 제3자의 저작권 등 지적재산권에 대한 침해</p>
              </li>
              <li>
                <span className="mark">⑥</span>
                <p className="layout-text">“몰” 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</p>
              </li>
              <li>
                <span className="mark">⑦</span>
                <p className="layout-text">
                  외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 몰에 공개 또는 게시하는 행위
                </p>
              </li>
              <li>
                <span className="mark">⑧</span>
                <p className="layout-text">비정상적인 구매 행위로 회사의 영업을 방해하는 행위</p>
              </li>
              <li>
                <span className="mark">⑨</span>
                <p className="layout-text">고객응대근로자에게 폭언 욕설을 하는 행위</p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제21조 (연결“몰”과 피연결“몰” 간의 관계)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  상위 “몰”과 하위 “몰”이 하이퍼링크(예: 하이퍼링크의 대상에는 문자, 그림 및 동화상 등이 포함됨)방식
                  등으로 연결된 경우, 전자를 연결 “몰”(웹사이트)이라고 하고 후자를 피연결 “몰”(웹사이트)이라고 합니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  연결“몰”은 피연결“몰”이 독자적으로 제공하는 재화 등에 의하여 이용자와 행하는 거래에 대해서 보증 책임을
                  지지 않는다는 뜻을 연결“몰”의 초기화면 또는 연결되는 시점의 팝업화면으로 명시한 경우에는 그 거래에
                  대한 보증 책임을 지지 않습니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제22조 (저작권의 귀속 및 이용제한)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  회사가 회원에게 제공하는 서비스에 대한 지식재산권을 포함한 일체의 권리는 회사에 귀속됩니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  회원이 서비스를 이용하는 과정에서 사용한 동영상 또는 사진, 작성한 게시물 및 해시태그 등(이하 “게시물
                  등”이라 합니다)에 대한 저작권을 포함한 일체의 권리는 별도의 의사표시가 없는 한 각 회원에게 귀속됩니다.
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  이용자는 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타
                  방법에 의하여 영리 목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
                </p>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  게시물 등은 회사가 운영하는 인터넷 사이트 및 모바일 애플리케이션을 통해 노출될 수 있으며, 검색 결과
                  또는 관련 프로모션 등에도 노출될 수 있습니다. 또한, 해당 노출을 위해 필요한 범위 내에서는 일부 수정,
                  편집되어 게시될 수 있습니다. 이 경우, 회사는 저작권법 규정을 준수하며, 회원은 언제든지 고객센터 또는
                  각 서비스 내 관리기능을 통해 해당 게시물 등에 대해 삭제, 비공개 등의 조치를 취할 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">5.</span>
                <p className="layout-text">
                  회원은 자신이 서비스에 게시한 게시물 등을 회사가 국내ㆍ외에서 다음 각 호의 목적으로 사용하는 것을
                  허락합니다.
                </p>
                <ol className="lst-indent">
                  <li>
                    <span className="mark">①</span>
                    <p className="layout-text">
                      서비스(서비스가 제3자가 운영하는 사이트 또는 미디어의 일정 영역 내에 입점하는 형태로 제공되는 경우
                      포함) 내에서 게시물 등의 복제·전송·전시 및 우수 게시물을 서비스 화면에 노출하기 위하여 게시물의
                      내용 변경 없이 크기를 변환하거나 단순화하는 등의 방식으로 수정하는 것
                    </p>
                  </li>
                  <li>
                    <span className="mark">②</span>
                    <p className="layout-text">
                      회사의 서비스를 홍보하기 위한 목적으로 미디어·통신사 등에 게시물의 전부 또는 일부를 보도·방영하게
                      하는 것. (이 경우 회사는 회원의 개별 동의 없이 미디어·통신사 등에게 회원정보를 제공하지 않음)
                    </p>
                  </li>
                </ol>
              </li>
              <li>
                <span className="mark">6.</span>
                <p className="layout-text">
                  회사는 서비스의 정책 또는 회사가 운영하는 서비스 간 통합 등의 사유로 게시물의 게재 위치를 변경·이전할
                  수 있으며, 이 경우 사전에 공지합니다.
                </p>
              </li>
              <li>
                <span className="mark">7.</span>
                <p className="layout-text">
                  회원이 이용계약을 해지하거나, 회사가 이용계약을 해지하는 경우, 회원이 서비스에 게시한 게시물은
                  삭제됩니다. 다만, 다른 회원 또는 제3자에게 의하여 다시 게시된 게시물 등 공용 서비스 내에 게재되어 다른
                  회원의 정상적인 서비스 이용에 필요한 게시물은 삭제되지 않습니다.
                </p>
              </li>
              <li>
                <span className="mark">8.</span>
                <p className="layout-text">
                  회사는 전항 이외의 방법으로 회원의 게시물 등을 이용하고자 하는 경우에는 사전에 회원의 동의를 얻습니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제23조 (게시물의 관리 및 이용 제한)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  서비스 내 모든 게시물 및 콘텐츠의 관리와 운영 권한은 작가 또는 해당 게시물 및 콘텐츠를 게시한 회원에게
                  있으며, 회원은 콘텐츠 삭제, 수정 등의 관리 기능이 제공되는 경우 이를 통하여 직접 자신의 게시물을
                  관리할 수 있습니다. 단, 회원의 요청이 있거나 기타 회사가 서비스의 원활한 운영을 위하여 필요하다고
                  판단되는 경우, 회사는 게시물의 관리 등과 관련한 사항을 개선, 지원하는 등의 활동을 할 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  회원의 게시물 등이 관련 법령에 위반되는 내용을 포함하거나 서비스 내에 게시된 게시물 등이 사생활 침해
                  또는 명예훼손 등 제3자의 권리를 침해한다고 인정하는 경우 회사는 해당 관련 법령이나 적법한 권리자의
                  요청에 따라 해당 게시물 등에 대한 게시중단 및 삭제 등의 조치를 취할 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  회사는 회원이 서비스 내에 게시한 게시물(회원 간 전달 포함)이 다음 각 호의 경우에 해당한다고 판단되는
                  경우 회원 또는 제3자의 신고가 없어도 사전통지 없이 삭제, 변경할 수 있으며, 이에 대해 회사는 어떠한
                  책임도 지지 않습니다.
                </p>
                <ol className="lst-indent">
                  <li>
                    <span className="mark">①</span>
                    <p className="layout-text">
                      회사, 다른 회원 또는 제3자를 비방하거나 중상모략으로 명예를 손상시키는 내용인 경우
                    </p>
                  </li>
                  <li>
                    <span className="mark">②</span>
                    <p className="layout-text">공공질서 및 미풍양속에 위반되는 내용의 게시물에 해당하는 경우</p>
                  </li>
                  <li>
                    <span className="mark">③</span>
                    <p className="layout-text">게시물의 내용이 범죄적 행위에 결부된다고 인정되는 내용인 경우</p>
                  </li>
                  <li>
                    <span className="mark">④</span>
                    <p className="layout-text">
                      회사의 저작권, 제3자의 저작권 등 기타 타인의 권리를 침해하는 내용인 경우
                    </p>
                  </li>
                  <li>
                    <span className="mark">⑤</span>
                    <p className="layout-text">회사에서 제공하는 서비스와 관련 없는 내용인 경우</p>
                  </li>
                  <li>
                    <span className="mark">⑥</span>
                    <p className="layout-text">불필요하거나 승인되지 않은 상업적 목적의 광고, 판촉물을 게재하는 경우</p>
                  </li>
                  <li>
                    <span className="mark">⑦</span>
                    <p className="layout-text">
                      타인의 ID, 명의 등을 무단으로 도용하여 작성한 내용이거나, 타인이 입력한 정보를 무단으로 위ㆍ변조한
                      내용인 경우
                    </p>
                  </li>
                  <li>
                    <span className="mark">⑧</span>
                    <p className="layout-text">동일한 내용을 중복하여 다수 게시하는 등 게시의 목적에 어긋나는 경우</p>
                  </li>
                  <li>
                    <span className="mark">⑨</span>
                    <p className="layout-text">
                      기타 관계 법령 및 회사의 각 서비스별 세부 이용 지침 등에 위반된다고 판단되는 경우
                    </p>
                  </li>
                </ol>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  정보통신망 이용촉진 및 정보보호 등에 관한 법률의 규정에 의해 다른 회원의 공개된 게시물 등이 본인의
                  사생활을 침해하거나 명예를 훼손하는 등 권리를 침해 받은 회원 또는 제3자는 그 침해사실을 소명하여
                  회사에 해당 게시물 등의 삭제 또는 반박 내용의 게재를 요청할 수 있습니다. 이 경우 회사는 해당 게시물
                  등의 권리 침해 여부를 판단할 수 없거나 당사자 간의 다툼이 예상되는 경우 해당 게시물 등에 대한 접근을
                  임시적으로 차단하는 조치(이하 “임시조치”라 합니다)를 회사가 정한 임시조치 기간 동안 취합니다.
                </p>
              </li>
              <li>
                <span className="mark">5.</span>
                <p className="layout-text">
                  본인의 게시물 등이 임시적으로 차단된 회원은 회사에 해당 게시물 등을 복원해 줄 것을 요청(이하 “재게시
                  청구”라 합니다)할 수 있으며, 회사는 임시조치된 게시물의 명예훼손 등 판단에 대한 방송통신심의위원회
                  심의 요청에 대한 게시자 및 삭제 등 신청인의 동의가 있는 경우 게시자 및 삭제 등 신청인을 대리하여 이를
                  요청하고 동의가 없는 경우 회사가 이를 판단하여 게시물 등의 복원 여부를 결정합니다. 게시자의 재게시
                  청구가 있는 경우 임시조치 기간 내에 방송통신심의위원회 또는 회사의 결정이 있으면 그 결정에 따르고 그
                  결정이 임시조치 기간 내에 있지 않는 경우 해당 게시물 등은 임시조치 만료일 이후 복원됩니다. 재게시
                  청구가 없는 경우 해당 게시물 등은 임시조치 기간 만료 이후 삭제됩니다.
                </p>
              </li>
              <li>
                <span className="mark">6.</span>
                <p className="layout-text">
                  회원의 게시물 등으로 인한 법률상 이익 침해를 근거로, 다른 회원 또는 제3자가 회원 또는 회사를 대상으로
                  하여 민·형사상의 법적 조치(예: 형사고소, 가처분 신청∙손해배상청구 등 민사소송의 제기)를 취하는 경우,
                  회사는 동 법적 조치의 결과인 법원의 확정판결이 있을 때까지 관련 게시물 등에 대한 접근을 잠정적으로
                  제한할 수 있습니다. 게시물 등의 접근 제한과 관련한 법적 조치의 소명, 법원의 확정 판결에 대한 소명
                  책임은 게시물 등에 대한 조치를 요청하는 자가 부담합니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제24조 (면책 조항)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  회사는 기간 통신 사업자의 서비스 중단 및 천재지변, 전쟁 등 불가항력적인 일의 발생으로 인하여 서비스의
                  중단이 있을 경우 이에 대해 면책됩니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  회사는 회원의 모바일 등 기기 오작동과 회원의 귀책사유로 인해 발생한 손해에 대하여 면책됩니다.
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  회사는 회원이 게시한 게시물에 대해 사전에 심사하거나 검토할 의무가 없으며 그로 인하여 발생한 분쟁에
                  대하여 면책됩니다.
                </p>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  본 조에도 불구하고 회사에게 고의 또는 과실이 인정되는 손해 발생에 대하여는 회사는 책임을 부담합니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제25조 (적립금)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  회사는 회원이 상품을 구매하거나 이벤트 참여 등의 “몰”을 이용하는 과정에서 회원에게 일정한 적립금을
                  부여할 수 있습니다. 이러한 적립금의 부여에 대한 구체적인 운영 방법은 회사의 운영 정책에 우선합니다.
                </p>
                <ol className="lst-indent">
                  <li>
                    <span className="mark">①</span>
                    <p className="layout-text">
                      상품 구매 시 부여받은 적립금은 상품 구매를 취소하거나 반품하는 경우 회사가 부여한 적립금을
                      회수합니다.
                    </p>
                  </li>
                  <li>
                    <span className="mark">②</span>
                    <p className="layout-text">적립금 지급률(액)은 상품 또는 회원별로 상이할 수 있습니다.</p>
                  </li>
                  <li>
                    <span className="mark">③</span>
                    <p className="layout-text">
                      적립금으로 구매한 상품을 취소하거나 반품하는 경우 사용된 적립금은 복구되며 복구된 적립금의 사용
                      기한은 적립금 사용 시점에 남아있던 기한에서 상품 취소/반품 시점만큼 추가하여 새로 산정합니다.
                    </p>
                  </li>
                </ol>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  회원은 “몰”에서 재화 구매 시 다른 결제 수단과 함께 적립금을 사용할 수 있습니다. 단, 현금으로
                  환불되지는 않으며 타인에게 양도할 수 없습니다.
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  적립금의 사용 기한은 최초 적립일로부터 6개월이며, 동 기한 내 사용하지 않은 적립금은 소멸됩니다. 단,
                  적립금 부여시 사용기간에 대해 별도의 사전 고지 또는 특약이 있는 경우 사용 기한이 달라질 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  적립금의 사용은 유효기간 종료일이 먼저 도래하거나, 유효기간이 동일한 경우 먼저 적립된 순서대로
                  사용됩니다.
                </p>
              </li>
              <li>
                <span className="mark">5.</span>
                <p className="layout-text">
                  회원을 탈퇴할 경우 적립금은 즉시 소멸됩니다. 탈퇴 후 재가입하더라도 소멸된 적립금은 복구되지 않습니다.
                </p>
              </li>
              <li>
                <span className="mark">6.</span>
                <p className="layout-text">
                  회사는 회원이 부정한 방법이나 목적으로 적립금을 획득했거나 적립금을 사용하는 경우 적립금의 사용 제한
                  및 적립금을 회수할 수 있으며 적립금을 사용한 구매 신청을 취소하거나 회원의 자격을 정지할 수 있습니다.
                </p>
                <ol className="lst-indent">
                  <li>
                    <span className="mark">①</span>
                    <p className="layout-text">특정 상품군에 대해 반복적인 구매를 지속적으로 진행하는 경우</p>
                  </li>
                  <li>
                    <span className="mark">②</span>
                    <p className="layout-text">고액의 상품군을 반복, 지속적으로 구매하는 경우</p>
                  </li>
                  <li>
                    <span className="mark">③</span>
                    <p className="layout-text">가전, 유아동 물품, 식품 등의 상품을 대량으로 구매하는 경우</p>
                  </li>
                  <li>
                    <span className="mark">④</span>
                    <p className="layout-text">
                      기타 회사가 정하는 일정 규모 이상의 거래 건으로 재판매를 위한 거래로 합리적으로 의심되는 경우
                    </p>
                  </li>
                </ol>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제26조 (할인쿠폰)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  회사는 회원이 “몰”에서 판매하는 재화를 구매하는 경우 일정금액 또는 일정비율을 할인 받을 수 있는 할인
                  쿠폰을 발급할 수 있습니다. 할인 쿠폰의 부여 및 사용에 대한 구체적인 운영 방법은 회사의 운영 정책에
                  우선합니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  할인 쿠폰은 브랜드 쿠폰, 장바구니 쿠폰 등 서비스 내에서 할인 혜택을 제공하는 모든 쿠폰을 통칭합니다.
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  회사는 할인 쿠폰의 사용 방법, 사용 기간, 할인액(비율)을 서비스 내에 명시합니다.
                </p>
              </li>
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">
                  회원은 “몰”에서 재화 구매 시 할인 쿠폰을 사용할 수 있으며 할인 쿠폰은 명시된 사용 기간 내만 사용할 수
                  있습니다.
                </p>
              </li>
              <li>
                <span className="mark">5.</span>
                <p className="layout-text">
                  회원은 할인 쿠폰을 본인의 거래에 대해서만 사용할 수 있으며, 계정 간 할인 쿠폰의 합산 및 이동이
                  불가능합니다.
                </p>
              </li>
              <li>
                <span className="mark">6.</span>
                <p className="layout-text">
                  할인 쿠폰을 사용한 상품을 취소 또는 반품하여 환불이 일어나는 경우 할인 쿠폰의 재사용을 위한 재발급은
                  할인 쿠폰 별로 상이한 정책을 가지며 재사용이 불가할 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">7.</span>
                <p className="layout-text">
                  회원을 탈퇴할 경우 지급된 할인 쿠폰은 즉시 소멸됩니다. 탈퇴 후 재가입하더라도 소멸된 할인 쿠폰은
                  복구되지 않습니다.
                </p>
              </li>
              <li>
                <span className="mark">8.</span>
                <p className="layout-text">
                  회사는 회원이 부정한 방법이나 목적으로 할인 쿠폰을 획득했거나 할인 쿠폰을 사용하는 경우 할인 쿠폰 사용
                  제한 및 할인 쿠폰을 회수할 수 있으며 할인 쿠폰을 사용한 구매 신청을 취소하거나 회원의 자격을 정지할 수
                  있습니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제27조 (온라인 경매 서비스)</h2>
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
        <article>
          <h2>제28조 (개별 서비스에 대한 약관 및 이용조건)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  회사는 개별서비스와 관련한 별도의 약관 및 이용정책을 둘 수 있으며, 개별서비스에서 별도로 적용되는
                  약관에 대한 동의는 회원이 개별서비스를 최초로 이용할 경우 별도의 동의절차를 거치게 됩니다. 이 경우
                  개별서비스에 대한 이용약관 등이 본 약관에 우선합니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  전항에도 불구하고 회사는 개별서비스에 대한 이용정책에 대해서는 서비스를 통해 공지할 수 있으며 회원은
                  이용정책을 숙지하고 준수하여야 합니다
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제29조 (분쟁해결)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  “몰”은 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여
                  피해보상처리기구를 설치, 운영합니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  “몰”은 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만, 신속한 처리가
                  곤란한 경우에는 이용자에게 그 사유와 처리 일정을 즉시 통보해 드립니다.
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  “몰”과 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해 구제 신청이 있는 경우에는
                  공정거래위원회 또는 시•도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
                </p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>제30조 (재판권 및 준거법)</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  “몰”과 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가
                  없는 경우에는 거소를 관할하는 지방 법원의 전속 관할로 합니다. 다만, 제소 당시 이용자의 주소 또는
                  거소가 분명하지 않거나 외국 거주자의 경우에는 민사 소송법상의 관할 법원에 제기합니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">“몰”과 이용자 간에 제기된 전자상거래 소송에는 한국법을 적용합니다.</p>
              </li>
            </ol>
          </div>
        </article>
        <article>
          <div className="layout-box">
            <ul className="lst-indent circle-delim" style={{ marginTop: '2rem' }}>
              <li>
                <p className="layout-text">현행 서비스이용약관 시행일자 : 2022년 2월 25일</p>
              </li>
            </ul>
          </div>
        </article>
        <article>
          <div className="layout-select layout-box">
            <Select size="medium" onChange={handleSelect} value="v1">
              {values.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.text}
                </Option>
              ))}
            </Select>
          </div>
        </article>
      </div>
    </Layout>
  );
};
