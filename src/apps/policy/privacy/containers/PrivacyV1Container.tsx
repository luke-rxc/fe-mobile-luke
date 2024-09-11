import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { UniversalLinkTypes } from '@constants/link';
import { Layout } from '@features/policy/components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useLink } from '@hooks/useLink';
import { Action } from '@pui/action';
import { Option, Select } from '@pui/select';
import { usePrivacyVersionService } from '../services';

export const PrivacyV1Container = () => {
  const { isApp } = useDeviceDetect();
  const { getLink } = useLink();
  const { handleGetVersionList, handleAnchor } = usePrivacyVersionService();
  const headerTriggerRef = useRef<HTMLDivElement>(null);
  const values = handleGetVersionList();
  const handleSelect = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    handleAnchor(target?.value);
  };
  return (
    <Layout className={isApp ? 'app' : ''} title="개인정보 처리방침" headerTriggerRef={headerTriggerRef}>
      <div id="policy-all">
        {!isApp && <h1>개인정보 처리방침</h1>}
        <article ref={headerTriggerRef}>
          <div className="layout-box">
            <p className="layout-text">
              (주)알엑스씨(이하 ‘회사’)는 이용자의 정보를 소중하게 생각하여 관련법규를 준수합니다.
            </p>
            <p className="layout-text">
              이에 회사는 ‘개인정보보호법’등 관련법규에 따른 개인정보처리방침을 정하여 회사 홈페이지에 공개하여 이용자가
              언제나 용이하게 열람할 수 있도록 하고 있습니다.
            </p>
            <p className="layout-text">
              이 방침은 회사 정책에 따라 수시로 변경될 수 있으며, 중요한 내용이 변경되는 경우에는 이용자가 변경 내용을
              확인할 수 있도록 웹사이트를 통하여 이용자에게 고지하겠습니다.
            </p>
          </div>
        </article>
        <article>
          <h2>1. 개인정보의 수집 및 이용 목적</h2>
          <div className="layout-box">
            <p className="layout-text">
              회사의 서비스는 상품 구매와 개인별 혜택 제공 및 이벤트 참여를 제외한 모든 서비스를 가입하지 않고 이용할 수
              있습니다.
            </p>
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  회사는 회원가입 시 서비스 제공과 편리하고 유익한 맞춤 정보를 제공하기 위해 필요한 최소한의 정보를 필수
                  사항으로 수집하고 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  회사는 이용자의 소중한 인권을 침해할 우려가 있는 민감한 정보(인종, 사상 및 신조, 정치적 성향이나
                  범죄기록, 의료정보 등)는 어떠한 경우에도 수집하지 않으며, 만약 불가피하게 수집하는 경우에는 반드시
                  이용자에게 사전 동의를 구하겠습니다.
                </p>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">회사는 회원들의 개인정보를 다음과 같이 수집합니다.</p>
              </li>
            </ol>
          </div>
          <div className="layout-table layout-box">
            <div className="table-box">
              <table className="table">
                <colgroup>
                  <col width="25%" />
                  <col width="25%" />
                  <col width="25%" />
                  <col width="25%" />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">수집시기</th>
                    <th scope="col">수집목적</th>
                    <th scope="col">구분</th>
                    <th scope="col">수집항목</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>회원가입 시 (이메일 가입)</td>
                    <td>회원관리 및 이용자 식별</td>
                    <td>필수</td>
                    <td>이메일주소</td>
                  </tr>
                  <tr>
                    <td>회원가입 시 (SNS 연동)</td>
                    <td>회원관리 및 이용자 식별</td>
                    <td>필수</td>
                    <td>이름, 이메일주소, 프로필이미지</td>
                  </tr>
                  <tr>
                    <td>회원가입 시 (SNS 연동)</td>
                    <td>회원관리 및 이용자 식별</td>
                    <td>선택</td>
                    <td>성별, 연령대, 생일</td>
                  </tr>
                  <tr>
                    <td>휴대폰 인증 시</td>
                    <td>회원관리 및 이용자 식별</td>
                    <td>필수</td>
                    <td>휴대폰번호</td>
                  </tr>
                  <tr>
                    <td>SNS 계정 연동 시</td>
                    <td>회원관리 및 이용자 식별</td>
                    <td>필수</td>
                    <td>이름, 이메일주소, 프로필이미지</td>
                  </tr>
                  <tr>
                    <td>SNS 계정 연동 시</td>
                    <td>회원관리 및 이용자 식별</td>
                    <td>선택</td>
                    <td>성별, 연령대, 생일</td>
                  </tr>
                  <tr>
                    <td>상품 주문 시</td>
                    <td>재화 또는 서비스 제공</td>
                    <td>필수</td>
                    <td>주문자 이름, 휴대폰번호, 이메일주소, 신용카드정보(카드번호, 카드사명)</td>
                  </tr>
                  <tr>
                    <td>상품 배송 시</td>
                    <td>재화 또는 서비스 제공</td>
                    <td>필수</td>
                    <td>수신인 이름, 휴대폰번호, 배송지 주소</td>
                  </tr>
                  <tr>
                    <td>PRIZM 간편결제 카드 등록 시</td>
                    <td>재화 또는 서비스 제공</td>
                    <td>필수</td>
                    <td>신용카드정보(카드번호, 카드사명)</td>
                  </tr>
                  <tr>
                    <td>이벤트 당첨 시</td>
                    <td>재화 또는 서비스 제공</td>
                    <td>필수</td>
                    <td>이름, 이메일주소, 휴대폰번호, 주소, 주민등록번호</td>
                  </tr>
                  <tr>
                    <td>고객 응대(CS) 시</td>
                    <td>고객 민원 사무 처리</td>
                    <td>-</td>
                    <td>이메일주소, 상품 주문 정보(이름, 휴대폰번호, 주소), 환불 계좌정보</td>
                  </tr>
                  <tr>
                    <td>마케팅 목적</td>
                    <td>마케팅 및 광고 활용</td>
                    <td>선택</td>
                    <td>성별, 연령대, 생일, 서비스 이용정보(주문내역, 장바구니내역)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">4.</span>
                <p className="layout-text">회사는 다음과 같은 방법으로 개인정보를 수집할 수 있습니다.</p>
                <ul className="lst-indent circle-delim">
                  <li>
                    <p className="layout-text">회원 가입, 상품 주문 이행을 위해 필수적인 정보를 직접 입력</p>
                  </li>
                  <li>
                    <p className="layout-text">
                      기존에 개인정보를 제공한 소셜 서비스 계정 연동 시 자동 수집 또는 제공할 항목 선택 제출
                    </p>
                  </li>
                  <li>
                    <p className="layout-text">고객 응대 및 취소∙환불 처리 시점에 유/무선으로 수집</p>
                  </li>
                  <li>
                    <p className="layout-text">
                      마케팅 및 분석, 프로모션 이벤트 진행 시 희망자에 한해 직접 입력 또는 제공 항목 선택 제출
                    </p>
                  </li>
                  <li>
                    <p className="layout-text">라이브 경매 서비스와 같은 특정 서비스 이용 시점에 직접 입력</p>
                  </li>
                </ul>
              </li>
            </ol>
          </div>
        </article>

        <article>
          <h2>2. 개인정보 보유 및 이용 기간</h2>
          <div className="layout-box">
            <p className="layout-text">
              이용자의 개인정보는 “개인정보파기절차 및 방법”의 기준으로 탈퇴요청 7일 후 개인정보 수집 및 이용목적이
              달성되면 지체없이 파기 합니다. 다만, 통신비밀보호법, 전자상거래 등에서의 소비자보호에 관한 법률 등
              관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 관계법령에서 정한 일정한 기간 동안 회원정보를
              보관합니다. 이 경우 회사는 보관하는 정보를 그 보관의 목적으로만 이용하며 보존기간은 아래와 같습니다.
            </p>
          </div>
          <div className="layout-table layout-box">
            <div className="table-box">
              <table className="table">
                <colgroup>
                  <col width="33.3%" />
                  <col width="33.3%" />
                  <col width="33.4%" />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">보존 항목</th>
                    <th scope="col">근거 법령</th>
                    <th scope="col">보존 기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>계약 또는 청약철회 등에 관한 기록</td>
                    <td>전자상거래 등에서의 소비자 보호에 관한 법률</td>
                    <td>5년</td>
                  </tr>
                  <tr>
                    <td>대금결제 및 재화 등의 공급에 관한 기록</td>
                    <td>전자상거래 등에서의 소비자 보호에 관한 법률</td>
                    <td>5년</td>
                  </tr>
                  <tr>
                    <td>소비자의 불만 또는 분쟁처리에 관한 기록</td>
                    <td>전자상거래 등에서의 소비자 보호에 관한 법률</td>
                    <td>3년</td>
                  </tr>
                  <tr>
                    <td>표시/광고에 관한 기록</td>
                    <td>전자상거래 등에서의 소비자 보호에 관한 법률</td>
                    <td>6개월</td>
                  </tr>
                  <tr>
                    <td>전자금융 거래에 관한 기록</td>
                    <td>전자금융거래법</td>
                    <td>5년</td>
                  </tr>
                  <tr>
                    <td>서비스 방문 기록</td>
                    <td>통신비밀보호법</td>
                    <td>3개월</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </article>

        <article>
          <h2>3. 개인정보의 파기절차 및 방법</h2>
          <div className="layout-box">
            <p className="layout-text">
              회사는 이용자의 회원 탈퇴 요청시 이용자의 실수 및 변심으로 인한 탈퇴요청을 취소할 수 있도록 요청일로부터
              최대 30일까지 사용자의 정보를 보관합니다. 사용자의 정보는 30일 이후 지체없이 파기합니다.
            </p>
            <p className="layout-text">
              단, 이용자에게 개인정보 보관기간에 대해 별도의 동의를 얻은 경우, 또는 법령에서 일정 기간 정보보관 의무를
              부과하는 경우에는 해당 기간 동안 개인정보를 안전하게 보관합니다.
            </p>
            <p className="layout-text">
              회사는 개인정보 유효기간제에 따라 1년간 서비스를 이용하지 않은 회원의 개인정보를 별도로 분리 보관하여
              관리하고 있습니다.
            </p>
            <p className="layout-text">
              회원 탈퇴, 서비스 종료, 이용자에게 동의 받은 개인정보 보유기간의 도래와 같이 개인정보의 수집 및 이용목적이
              달성된 개인정보는 재생이 불가능한 방법으로 파기하고 있습니다. 법령에서 보존의무를 부과한 정보에 대해서도
              해당 기간 경과 후 지체없이 재생이 불가능한 방법으로 파기합니다.
            </p>
            <p className="layout-text">
              전자적 파일 형태의 경우 복구 및 재생이 되지 않도록 기술적인 방법을 이용하여 안전하게 삭제하며, 출력물 등은
              분쇄하거나 소각하는 방식 등으로 파기합니다.
            </p>
          </div>
        </article>

        <article>
          <h2>4. 개인정보 제3자 제공</h2>
          <div className="layout-box">
            <p className="layout-text">
              회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 단, 주문과 결제가 이루어진 경우, 상담 및
              배송 등 원활한 거래 이행을 위하여 관련된 정보를 필요한 범위 내에서 판매자(제3자)에게 전달합니다. 주문
              시에만 판매자(제3자)에게 개인정보가 제공되며 주문 시 안내해드립니다. 판매자(제3자)에게 개인정보 제공을
              거부하실 수 있으나, 이 경우 서비스 이용이 제한될 수 있습니다.
            </p>
          </div>
          <div className="layout-table layout-box">
            <div className="table-box">
              <table className="table row-style privary-4">
                <colgroup>
                  <col width="120px" />
                  <col width="auto" />
                </colgroup>
                <tbody>
                  <tr>
                    <td>제공받는 자</td>
                    <td>
                      <span>상품 판매 입점사 - </span>
                      <Action is="a" className="hyper-link" link={getLink(UniversalLinkTypes.POLICY_PRIVACY_PROVIDER)}>
                        입점사 목록 보기
                      </Action>
                    </td>
                  </tr>
                  <tr>
                    <td>제공 목적</td>
                    <td>상품 주문 확인 및 배송 업무</td>
                  </tr>
                  <tr>
                    <td>제공 정보</td>
                    <td>
                      <span>
                        성명, 휴대폰 번호, 이메일, 배송지 주소 (구매자와 수취인이 다를 경우 수취인의 정보 제공)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>보유 및 이용기간</td>
                    <td>
                      재화 또는 서비스의 제공 목적이 달성된 후 파기(단, 관계법령에 정해진 규정에 따라 법정기간동안 보관)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </article>

        <article>
          <h2>5. 수집한 개인정보 처리 위탁</h2>
          <div className="layout-box">
            <p className="layout-text">
              회사는 서비스 향상을 위해서 이용자의 개인정보를 외부에 수집/취급관리 등을 위탁하여 처리할 수 있으며, 관련
              법규의 규정에 따라 위탁계약 시 개인정보가 안전하게 관리될 수 있도록 규정하고 있습니다.
            </p>
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">수탁자, 수탁 범위 등에 관한 사항을 홈페이지를 통해 게시</p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  위탁계약 시 서비스제공자의 개인정보보호 관련 지시엄수, 개인정보에 관한 비밀유지, 제3자 제공의 금지 및
                  사고시의 책임부담, 위탁기간, 처리 종료 후의 개인정보의 반환 또는 파기 등을 규정하고 당해 계약 내용을
                  서면 또는 전자적으로 보관
                </p>
              </li>
            </ol>
          </div>
          <div className="layout-table layout-box">
            <div className="table-box">
              <table className="table">
                <colgroup>
                  <col width="25%" />
                  <col width="25%" />
                  <col width="25%" />
                  <col width="25%" />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">이름</th>
                    <th scope="col">연동 상세</th>
                    <th scope="col">업체의 소재지</th>
                    <th scope="col">보유 및 이용기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>(주)굿스플로</td>
                    <td>
                      배송정보 연동 서비스
                      <br />
                      카카오 알림톡 발송(알리미) 서비스
                    </td>
                    <td>국내</td>
                    <td>회원 탈퇴 시 또는 위탁 계약 종료 시까지</td>
                  </tr>
                  <tr>
                    <td>(주)카카오</td>
                    <td>카카오 알림톡 발송 서비스</td>
                    <td>국내</td>
                    <td>회원 탈퇴 시 또는 위탁 계약 종료 시까지</td>
                  </tr>
                  <tr>
                    <td>(주)에스엠티엔티</td>
                    <td>문자메시지 발송 서비스</td>
                    <td>국내</td>
                    <td>회원 탈퇴 시 또는 위탁 계약 종료 시까지</td>
                  </tr>
                  <tr>
                    <td>(주)아임포트</td>
                    <td>결제 대행 서비스, 휴대폰 번호인증 서비스</td>
                    <td>국내</td>
                    <td>회원 탈퇴 시 또는 위탁 계약 종료 시까지</td>
                  </tr>
                  <tr>
                    <td>엔에이치엔한국사이버결제(주), 주식회사 카카오페이, 네이버파이낸셜(주)</td>
                    <td>결제 대행 서비스</td>
                    <td>국내</td>
                    <td>회원 탈퇴 시 또는 위탁 계약 종료 시까지</td>
                  </tr>
                  <tr>
                    <td>Amazon Web Services, Inc.</td>
                    <td>서비스 인프라 구축</td>
                    <td>국외(미국)</td>
                    <td>회원 탈퇴 시 또는 위탁 계약 종료 시까지</td>
                  </tr>
                  <tr>
                    <td>Zendesk, Inc.</td>
                    <td>고객 상담 서비스</td>
                    <td>국외(미국)</td>
                    <td>회원 탈퇴 시 또는 위탁 계약 종료 시까지</td>
                  </tr>
                  <tr>
                    <td>Sendbird, Inc.</td>
                    <td>라이브 방송 채팅 서비스</td>
                    <td>국외(미국)</td>
                    <td>회원 탈퇴 시 또는 위탁 계약 종료 시까지</td>
                  </tr>
                  <tr>
                    <td>Google, Inc.</td>
                    <td>서비스 주요 지표 및 통계 정보 확인</td>
                    <td>국외(미국)</td>
                    <td>회원 탈퇴 시 또는 위탁 계약 종료 시까지</td>
                  </tr>
                  <tr>
                    <td>MoEngage, Inc.</td>
                    <td>대고객 메시지 발송 서비스 (앱푸시, 앱내팝업)</td>
                    <td>국외(미국)</td>
                    <td>회원 탈퇴 시 또는 위탁 계약 종료 시까지</td>
                  </tr>
                  <tr>
                    <td>MixPanel, Inc.</td>
                    <td>서비스 주요 지표 및 통계 정보 확인</td>
                    <td>국외(미국)</td>
                    <td>회원 탈퇴 시 또는 위탁 계약 종료 시까지</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </article>

        <article>
          <h2>6. 이용자의 권리와 의무</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  서비스를 사용하는 회원 및 법정대리인은 언제든지 수집 정보에 대해 수정, 동의, 철회, 삭제, 열람 등을
                  요청할 수 있습니다. 다만 동의 철회, 삭제 시 서비스의 일부 또는 전부 이용이 제한될 수 있습니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  회원 본인은 자신의 개인정보를 보호할 의무가 있습니다. 회사의 귀책사유 없이 이메일 주소, 로그인
                  인증번호, 소셜로그인 정보 등의 양도∙대여∙분실이나 로그인 상태에서 이석 등 본인의 부주의, 또는
                  관계법령에 의한 보안조치로 차단할 수 없는 방법이나 기술을 사용한 해킹 등 회사가 통제할 수 없는
                  인터넷상의 문제 등으로 개인정보가 유출되어 발생한 문제에 대해서 회사는 책임을 지지 않습니다.
                </p>
              </li>
            </ol>
          </div>
        </article>

        <article>
          <h2>7. 광고성 정보 전송</h2>{' '}
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">
                  회사는 이용자의 명시적인 수신거부의사에 반하여 영리목적의 광고성 정보를 전송하지 않습니다.
                </p>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">
                  회사는 안내 등 온라인 마케팅을 위해 광고성 정보를 모바일 앱푸시, 전자우편 등으로 전송하는 경우
                  정보통신망법의 규정에 따라 제목란 및 본문 란에 다음 사항과 같이 이용자께서 쉽게 알아 볼 수 있도록
                  조치합니다.
                </p>
                <ul className="lst-indent circle-delim">
                  <li>
                    <p className="layout-text">
                      제목 란 : (광고)라는 문구를 제목란에 표시하지 않을 수 있으며 전자우편 본문 란의 주요 내용을
                      표시합니다.
                    </p>
                  </li>
                  <li>
                    <p className="layout-text">
                      본문 란 : 이용자가 수신거부의 의사표시를 할 수 있는 전송자의 명칭, 전자우편 주소, 전화번호 및 주소
                      등 이용자가 수신거부의 의사를 쉽게 표시할 수 있는 방법을 명시합니다.
                    </p>
                  </li>
                </ul>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">
                  다음과 같이 청소년에게 유해한 정보를 전송하는 경우 “(광고)” 문구를 표시합니다.
                </p>
                <ol className="lst-indent circle-delim">
                  <li>
                    <p className="layout-text">
                      본문 란에 다음 각 항목에 해당하는 것이 부호, 문자, 영상 또는 음향의 형태로 표현된 경우(해당
                      전자우편의 본문 란에는 직접 표현되어 있지 아니하더라도 수신자가 내용을 쉽게 확인할 수 있도록
                      기술적 조치가 되어 있는 경우를 포함)에는 해당 전자우편의 제목 란에 “(광고)” 문구를 표시합니다.
                    </p>
                  </li>
                  <li>
                    <p className="layout-text">
                      청소년(19세미만의 자를 말한다. 이하 같다)에게 성적인 욕구를 자극하는 선정적이거나 음란한 것
                    </p>
                  </li>
                  <li>
                    <p className="layout-text">청소년에게 포악성이나 범죄의 충동을 일으킬 수 있는 것</p>
                  </li>
                  <li>
                    <p className="layout-text">
                      성폭력을 포함한 각종 형태의 폭력 행사와 약물의 남용을 자극하거나 미화하는 것
                    </p>
                  </li>
                  <li>
                    <p className="layout-text">청소년보호법에 의하여 청소년 유해매체물로 결정, 고시된 것</p>
                  </li>
                  <li>
                    <p className="layout-text">
                      영리목적의 광고성 전자우편 본문 란에서 제3항 각 항목에 해당하는 내용을 다룬 인터넷 홈페이지를
                      알리는 경우에는 해당 전자우편의 제목 란에 “(광고)” 문구를 표시합니다.
                    </p>
                  </li>
                </ol>
              </li>
              <li>
                <span className="mark">4</span>
                <p className="layout-text">
                  팩스, 휴대폰 문자전송 등 전자우편 이외의 문자 전송을 통해 영리목적의 광고성 정보를 전송하는 경우에는
                  전송내용 처음에 “(광고)”라는 문구를 표기하고 전송내용 중에 전송자의 연락처를 명시하도록 조치합니다.
                </p>
              </li>
            </ol>
          </div>
        </article>

        <article>
          <h2>8. 개인정보 자동 수집 장치의 설치 / 운영 및 거부에 관한 사항</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">쿠키의 정의</p>
                <ul className="lst-indent circle-delim">
                  <li>
                    <p className="layout-text">
                      회사는 이용자에게 보다 적절하고 유용한 서비스를 제공하기 위하여 이용자의 정보를 수시로 저장하고
                      불러오는 ‘쿠키(cookie)’를 사용합니다. 쿠키란 회사의 웹사이트를 운영하는데 이용되는 서버가 이용자의
                      컴퓨터로 전송하는 아주 작은 텍스트 파일로서 이용자의 컴퓨터 하드디스크에 저장됩니다. 쿠키는
                      이용자의 컴퓨터는 식별하지만 이용자를 개인적으로 식별하지는 않습니다. 또한 이용자는 쿠키의 사용
                      여부에 대하여 선택할 수 있습니다.
                    </p>
                  </li>
                  <li>
                    <p className="layout-text">
                      모바일 어플리케이션과 같이 쿠키 기능을 사용할 수 없는 경우에는 쿠키와 유사한 기능을 수행하는
                      기술(광고식별자 등)을 사용할 수 있습니다.
                    </p>
                  </li>
                </ul>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">쿠키 사용 목적</p>
                <ol className="lst-indent circle-delim">
                  <li>
                    <p className="layout-text">
                      이용자의 접속 빈도나 방문 시간, 관심분야 등을 파악하여 서비스의 개선, 맞춤 서비스 제공 및 마케팅
                      용도로 활용할 수 있습니다.
                    </p>
                  </li>
                </ol>
              </li>
              <li>
                <span className="mark">3.</span>
                <p className="layout-text">쿠키 설정 거부 방법</p>
                <ol className="lst-indent circle-delim">
                  <li>
                    <p className="layout-text">
                      이용자가 사용하는 웹 브라우저의 옵션을 설정함으로써 모든 쿠키를 허용하거나 쿠키를 저장할 때마다
                      확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다. 단, 쿠키의 저장을 거부할 경우 로그인이
                      필요한 일부 서비스의 이용에 제한이 생길 수 있습니다.
                    </p>
                  </li>
                  <li>
                    <p className="layout-text">쿠키 설치 허용 여부를 지정하는 방법 (Chrome 브라우저의 경우)</p>
                    <p className="layout-text indent  empty-circle-delim">
                      [설정] → 화면 하단의 [고급 설정 표시] 선택 → 개인정보 섹션의 [콘텐츠 설정] 버튼 클릭 → 쿠키
                      섹션에서 직접 설정
                    </p>
                  </li>
                </ol>
              </li>
            </ol>
          </div>
        </article>

        <article>
          <h2>9. 모바일 앱 사용시 광고 식별자 수집</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">수집의 목적</p>
                <ul className="lst-indent  circle-delim">
                  <li>
                    <p className="layout-text">
                      회사는 이용자의 ADID/IDFA를 수집할 수 있습니다. ADID/IDFA란 모바일 앱 이용자의 광고 식별 값으로서,
                      사용자의 맞춤 서비스 제공이나 더 나은 환경의 광고를 제공하기 위한 측정을 위해 수집될 수 있습니다.
                    </p>
                  </li>
                </ul>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">수집 거부 방법</p>
                <ul className="lst-indent  circle-delim">
                  <li>
                    <p className="layout-text">iOS 설정 → 개인정보보호 → 추적 → 앱 추적 비활성화</p>
                  </li>
                  <li>
                    <p className="layout-text">
                      안드로이드 설정 → 구글(구글설정) → 광고 → 광고 ID 삭제 (또는 맞춤설정 선택 해제)
                    </p>
                  </li>
                </ul>
              </li>
            </ol>
          </div>
        </article>

        <article>
          <h2>10. 개인정보의 기술적, 관리적 대책</h2>
          <div className="layout-box">
            <ol className="lst-indent">
              <li>
                <span className="mark">1.</span>
                <p className="layout-text">기술적 대책</p>
                <ul className="lst-indent  circle-delim">
                  <li>
                    <p className="layout-text">
                      회사는 이용자의 개인정보보호를 위해 중요 개인정보를 암호화하고 있으며, 이용자가 제공하는
                      결제정보를 암호화하여 통신하고 있습니다.
                    </p>
                  </li>
                  <li>
                    <p className="layout-text">
                      불법적인 해킹방지를 위해 자체 첨단 방화벽을 설치하여 운영하고 있습니다.
                    </p>
                  </li>
                  <li>
                    <p className="layout-text">
                      실제로 운영되고 있는 웹서버의 IP를 숨김으로써 불법적인 해킹 방지를 하고 있으며 더욱 안전한
                      개인정보보호를 위해 각종 첨단 보안 시스템을 도입하고 있습니다.
                    </p>
                  </li>
                </ul>
              </li>
              <li>
                <span className="mark">2.</span>
                <p className="layout-text">관리적 대책</p>
                <ul className="lst-indent  circle-delim">
                  <li>
                    <p className="layout-text">
                      회사는 이용자의 개인정보에 대한 접근권한을 최소한의 인원으로 제한하고 있습니다. 그 최소한의 인원에
                      해당하는 자는 다음과 같습니다.
                    </p>
                    <ul className="lst-indent empty-circle-delim">
                      <li>
                        <p className="layout-text">이용자를 직접 상대로 하여 마케팅 업무를 수행하는 자</p>
                      </li>
                      <li>
                        <p className="layout-text">개인정보보호책임자 및 담당자 등 개인정보 관리업무를 수행하는 자</p>
                      </li>
                      <li>
                        <p className="layout-text">기타 업무상 개인정보의 취급이 불가피한 자</p>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <p className="layout-text">
                      개인정보를 취급하는 인원에 대하여 개인정보보호를 위한 정기적인 교육 및 외부 위탁교육을 실시하고
                      있습니다.
                    </p>
                  </li>
                  <li>
                    <p className="layout-text">
                      회사는 내부 관리자의 과실이나 기술관리상의 사고로 인하여 개인정보가 유출, 변조, 훼손된 경우에는
                      즉각 이용자에게 그 사실을 알리고 적절한 대책을 강구할 것입니다.
                    </p>
                  </li>
                  <li>
                    <p className="layout-text">
                      이용자의 실수 또는 회사의 귀책사유가 없는 인터넷 상의 위험성으로 인하여 발생한 일들에 대하여
                      회사는 책임을 지지 않으므로 이용자의 아이디와 비밀번호가 타인에게 알려지지 않도록 적절하게
                      관리하여야 합니다.
                    </p>
                  </li>
                </ul>
              </li>
            </ol>
          </div>
        </article>

        <article>
          <h2>11. 개인정보보호 담당자 및 민원 처리</h2>
          <div className="layout-box">
            <p className="layout-text">
              회원의 개인정보를 보호하고 개인정보와 관련된 불만 등을 처리하기 위해 고객서비스담당 부서 및
              개인정보보호책임자를 두고 있습니다. 회원의 개인정보와 관련한 문의사항은 아래의 고객서비스담당 부서 또는
              개인정보보호책임자에게 연락하여 주시기 바랍니다.
            </p>
          </div>
          <div className="layout-table layout-box">
            <div className="table-box">
              <table className="table">
                <colgroup>
                  <col width="120px" />
                  <col width="auto" />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">구분</th>
                    <th scope="col">상세 정보</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>개인정보보호책임자(CPO)</td>
                    <td>하지수</td>
                  </tr>
                  <tr>
                    <td>개인정보보호부서</td>
                    <td>(주)알엑스씨 개인정보보호팀</td>
                  </tr>
                  <tr>
                    <td>고객서비스 담당부서</td>
                    <td>CX실</td>
                  </tr>
                  <tr>
                    <td>전화번호</td>
                    <td>1644-3920</td>
                  </tr>
                  <tr>
                    <td>이메일 주소</td>
                    <td>privacy@rxc.co.kr </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="layout-box">
            <p className="layout-text">
              기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.
            </p>
            <ul className="lst-indent circle-delim">
              <li>
                <p className="layout-text">개인정보침해신고센터 : http://privacy.kisa.or.kr / (국번없이)118</p>
              </li>
              <li>
                <p className="layout-text">대검찰청 사이버수사과 : http://www.spo.go.kr / (국번 없이) 1301</p>
              </li>
              <li>
                <p className="layout-text">
                  경찰청 사이버수사국 : https://ecrm.cyber.go.kr/minwon/main (국번 없이) 182
                </p>
              </li>
              <li>
                <p className="layout-text">개인정보분쟁조정위원회 : http://www.kopico.go.kr / 1833-6972</p>
              </li>
            </ul>
          </div>
        </article>
        <article>
          <h2>12. 개인정보 처리방침의 개정과 그 공지</h2>
          <div className="layout-box">
            <p className="layout-text">
              이 개인정보 처리방침은 2022년 2월 25일에 최초 고지되었으며 정부의 정책 및 정보보호 유관법령 또는
              보안기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 시에는 개정 최소 7일 전부터 서비스 내 ‘공지사항’
              을 통해 고지할 것입니다. 변경된 개인정보처리방침은 변경 고지한 날로부터 7일 후부터 효력이 발생합니다.
            </p>
            <ul className="lst-indent circle-delim">
              <li>
                <p className="layout-text">개인정보 처리방침 시행일자 : 2022년 2월 25일</p>
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
