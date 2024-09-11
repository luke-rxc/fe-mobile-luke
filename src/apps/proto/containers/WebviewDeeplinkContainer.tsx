import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import env from '@env';
import { Button } from '@pui/button';
import { TextField } from '@pui/textfield';

const { appLinkUrl } = env.app;

interface ListProps {
  title: string;
  pathParam: string;
  tfName?: string;
  tfRef?: React.RefObject<HTMLInputElement>;
  onClick: (p: string, r: React.RefObject<HTMLInputElement> | null) => void;
}

const ListComponent: React.FC<ListProps> = ({ title, pathParam, tfName, tfRef, onClick }) => {
  const handleClick = (p: string, r: React.RefObject<HTMLInputElement> | null) => {
    window.scrollTo(0, -400);
    onClick(p, r);
  };

  return (
    <>
      <li>
        <dl>
          <h5>{title}</h5>
        </dl>
        <dt>
          {tfRef && (
            <>
              <p>{tfName}</p>
              <TextFieldStyled ref={tfRef} />
            </>
          )}

          <Button color="black" onClick={() => handleClick(pathParam, tfRef ?? null)}>
            Deep Link
          </Button>
        </dt>
      </li>
    </>
  );
};

export const WebviewDeeplinkContainer: React.FC = () => {
  const manualRef = useRef<HTMLInputElement>(null);
  const [currentUrl, setCurrentUrl] = useState('');

  const handleConfirm = (link: string, ref?: React.RefObject<HTMLInputElement> | null) => {
    const args = ref?.current ?? null;
    const argsValue = args ? `${args.value}` : '';
    const webLink = link.indexOf('web') !== -1 && argsValue ? `${encodeURIComponent(argsValue)}` : '';
    const normalLink = argsValue ? `/${argsValue}` : '';
    const deepLink =
      link.indexOf('web') !== -1 ? `${appLinkUrl}/${link}?link=${webLink}` : `${appLinkUrl}/${link}${normalLink}`;
    if (args) {
      args.value = '';
    }
    setCurrentUrl(deepLink);
    window.location.href = deepLink;
  };

  const manualTfInject = () => {
    if (manualRef.current) {
      manualRef.current.value = appLinkUrl;
    }
  };

  const manualTfMove = () => {
    if (manualRef.current) {
      window.alert(`이동할 Deep Link : ${manualRef.current.value}`);
      window.location.href = manualRef.current.value;
    }
  };

  return (
    <>
      <InfoWrapper>
        <h5>적용된 Deep Link</h5>
        {currentUrl && <a href={currentUrl}>{currentUrl}</a>}
      </InfoWrapper>

      <hr />
      <Wrapper>
        <ManualWrapper>
          <h5>Manual</h5>
          <Button color="tint3" onClick={manualTfInject}>
            Add to App Base URL
          </Button>
          <div className="area">
            <TextFieldStyled ref={manualRef} className="tf" />
            <Button color="tint" onClick={manualTfMove}>
              Move
            </Button>
          </div>
        </ManualWrapper>
        <hr />
        <ListComponent title="Sign in / up" pathParam="signin" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent
          title="Verification Code"
          pathParam="verificationcode"
          tfName="verification code"
          tfRef={useRef<HTMLInputElement>(null)}
          onClick={(l, r) => handleConfirm(l, r)}
        />
        <hr />
        <ListComponent title="Home Tab" pathParam="home" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent title="Discover Tab" pathParam="discover" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent title="Bag Tab" pathParam="bag" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent title="MyPage Tab" pathParam="mypage" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent
          title="Story"
          pathParam="story"
          tfName="storyCode"
          tfRef={useRef<HTMLInputElement>(null)}
          onClick={(l, r) => handleConfirm(l, r)}
        />
        <hr />
        <ListComponent
          title="Live"
          pathParam="live"
          tfName="liveId"
          tfRef={useRef<HTMLInputElement>(null)}
          onClick={(l, r) => handleConfirm(l, r)}
        />
        <hr />
        <ListComponent
          title="Showroom"
          pathParam="showroom"
          tfName="showroomCode"
          tfRef={useRef<HTMLInputElement>(null)}
          onClick={(l, r) => handleConfirm(l, r)}
        />
        <hr />
        <ListComponent
          title="StoryList"
          pathParam="storylist"
          tfName="brandId"
          tfRef={useRef<HTMLInputElement>(null)}
          onClick={(l, r) => handleConfirm(l, r)}
        />
        <hr />
        <ListComponent
          title="Goods landingType push"
          pathParam="goods/push"
          tfName="GoodsId"
          tfRef={useRef<HTMLInputElement>(null)}
          onClick={(l, r) => handleConfirm(l, r)}
        />
        <hr />
        <ListComponent
          title="Goods landingType modal"
          pathParam="goods/modal"
          tfName="GoodsId"
          tfRef={useRef<HTMLInputElement>(null)}
          onClick={(l, r) => handleConfirm(l, r)}
        />
        <hr />
        <ListComponent
          title="Story List"
          pathParam="storylist"
          tfName="brandId"
          tfRef={useRef<HTMLInputElement>(null)}
          onClick={(l, r) => handleConfirm(l, r)}
        />
        <hr />
        <ListComponent
          title="Showroom List"
          pathParam="showroomlist"
          tfName="keywordId"
          tfRef={useRef<HTMLInputElement>(null)}
          onClick={(l, r) => handleConfirm(l, r)}
        />
        <hr />
        <ListComponent
          title="Goods List"
          pathParam="goodslist"
          tfName="keywordId"
          tfRef={useRef<HTMLInputElement>(null)}
          onClick={(l, r) => handleConfirm(l, r)}
        />
        <hr />
        <ListComponent
          title="Subscribed Showroom"
          pathParam="subscribedshowroom"
          onClick={(l, r) => handleConfirm(l, r)}
        />
        <hr />
        <ListComponent
          title="Checkout"
          pathParam="checkout"
          tfName="checkoutId"
          tfRef={useRef<HTMLInputElement>(null)}
          onClick={(l, r) => handleConfirm(l, r)}
        />
        <hr />
        <ListComponent
          title="Checkout (Auction)"
          pathParam="auctioncheckout"
          tfName="auctionId"
          tfRef={useRef<HTMLInputElement>(null)}
          onClick={(l, r) => handleConfirm(l, r)}
        />
        <hr />
        <ListComponent title="Notification" pathParam="notification" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent title="Coupon" pathParam="coupon" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent title="Orders" pathParam="orders" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent title="Recent Goods List" pathParam="recentgoodslist" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent title="Wishlist" pathParam="wishlist" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent title="Point" pathParam="point" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent title="Manage Pay" pathParam="managepay" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent title="Manage Delivery" pathParam="managedelivery" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent title="Notice" pathParam="notice" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent title="FAQ" pathParam="faq" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent title="Q&A" pathParam="qna" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent title="Setting" pathParam="setting" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent
          title="Notification Setting"
          pathParam="notificationsetting"
          onClick={(l, r) => handleConfirm(l, r)}
        />
        <hr />
        <ListComponent title="Profile Setting" pathParam="profilesetting" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent title="Account Setting" pathParam="accountSetting" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent title="Share" pathParam="share" onClick={(l, r) => handleConfirm(l, r)} />
        <hr />
        <ListComponent
          title="Web landingType push"
          pathParam="web/push"
          tfName="Web URL"
          tfRef={useRef<HTMLInputElement>(null)}
          onClick={(l, r) => handleConfirm(l, r)}
        />
        <hr />
        <ListComponent
          title="Web landingType modal"
          pathParam="web/modal"
          tfName="Web URL"
          tfRef={useRef<HTMLInputElement>(null)}
          onClick={(l, r) => handleConfirm(l, r)}
        />
        <hr />
      </Wrapper>
    </>
  );
};

const InfoWrapper = styled.div`
  position: fixed;
  width: 100vw;
  top: 0;
  padding: 1rem;
  background: #fff;
  border: 0.1rem solid #000;
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.color.red};
  & > a {
    color: ${({ theme }) => theme.color.tint};
  }
`;

const ManualWrapper = styled.div`
  .area {
    display: flex;
    align-items: center;
    margin: 1rem 0 0 0;
  }
  .tf {
    margin: 0;
  }
`;

const Wrapper = styled.ul`
  margin-top: 8rem;
  padding: 2rem;
  & li dt {
    margin-top: 1rem;
    display: flex;
    align-items: center;
  }
`;

const TextFieldStyled = styled(TextField)`
  margin: 0 10px;
  & input {
    color: ${({ theme }) => theme.color.black};
  }
`;
