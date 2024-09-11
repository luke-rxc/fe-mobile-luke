import React, { useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import isEmpty from 'lodash/isEmpty';
import env from '@env';
import { useLink } from '@hooks/useLink';
import { Button } from '@pui/button';
import { AppLinkTypes, UniversalLinkTypes, WebLinkTypes } from '@constants/link';
import { CollapseMoreSection, CollapseMoreSectionRef } from '@features/collapse/components';
import { ListItemButton } from '@pui/listItemButton';
import { useWebInterface } from '@hooks/useWebInterface';
import { Clipboard } from '@pui/icon';
import { getAppLink, getWebLink } from '@utils/link';
import { userAgent } from '@utils/ua';
import { GoodsModel } from '../models';
import { GoodsDetailInfoType, GoodsMessage, GoodsPageName } from '../constants';
import { GoodsAccomInfo } from './GoodsAccomInfo';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  goodsId: number;
  benefitDescription?: GoodsModel['benefitDescription'];
  accom?: GoodsModel['accom'];
  description?: GoodsModel['description'];
  code: GoodsModel['code'];
  isOndaDeal: boolean;
  isDetailView: boolean;
  isDetailInfoView: boolean;
  onScrollAccomInfo: (tagType: string) => void;
  onExpandView: () => void;
  onClickCode: () => void;
  onContentClick: () => void;
  onDetailInfoClick: () => void;
}

const GoodsDescriptionComponent = ({
  goodsId,
  accom,
  benefitDescription,
  description,
  code,
  isOndaDeal,
  isDetailView,
  isDetailInfoView,
  onScrollAccomInfo,
  onExpandView,
  onClickCode,
  onContentClick,
  onDetailInfoClick,
  className,
}: Props) => {
  const { isApp } = userAgent();
  const { getLink, toLink } = useLink();
  const { open, showToastMessage } = useWebInterface();

  const collapseRef = useRef<CollapseMoreSectionRef>(null);

  const [expanded, setExpanded] = useState<boolean>(true);

  useLayoutEffect(() => {
    if (!collapseRef.current) {
      return;
    }

    const paddingBottom = 12;
    const { ref, collapsedHeight } = collapseRef.current;
    if (collapseRef.current && ref.offsetHeight > collapsedHeight + paddingBottom) {
      setExpanded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExpandView = () => {
    if (expanded) {
      return;
    }
    setExpanded(true);
    onExpandView();
  };

  const handleClickCode = () => {
    if (!code) {
      return;
    }

    copy(code);
    showToastMessage({ message: GoodsMessage.COPY_GOODS_MODEL });
    onClickCode();
  };

  const handleContentClick = () => {
    toLink(getLink(UniversalLinkTypes.GOODS_DETAIL, { goodsId }));
    onContentClick();
  };

  const handleDetailInfoClick = () => {
    onDetailInfoClick();
    const webLink = getWebLink(
      WebLinkTypes.GOODS_DETAIL_INFO,
      isOndaDeal ? { goodsId, type: GoodsDetailInfoType.ONDA } : { goodsId },
    );

    if (isApp) {
      const url = getAppLink(AppLinkTypes.WEB, {
        landingType: 'push',
        url: `${env.endPoint.baseUrl}${webLink}`,
        rootNavigation: 'false',
      });
      open({ url, initialData: {} });

      return;
    }

    toLink(webLink);
  };

  return (
    <div className={className}>
      {benefitDescription && (
        <div className="benefit-info">
          <p className="benefit-title">{benefitDescription.title}</p>

          <ul>
            {benefitDescription.messages.map((message) => (
              <li className="benefit-description" key={message}>
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isEmpty(accom) && accom && (
        <div className="accom-info">
          {accom.map((accomData) => (
            <>
              {!isEmpty(accomData.contents) && (
                <GoodsAccomInfo key={accomData.title} accom={accomData} onScrollAccomInfo={onScrollAccomInfo} />
              )}
            </>
          ))}
        </div>
      )}

      {description && (
        <CollapseMoreSection ref={collapseRef} expanded={expanded} expanderMaxLine={3} onExpandView={handleExpandView}>
          {description}
        </CollapseMoreSection>
      )}

      {code && (
        <ListItemButton
          is="div"
          title={code}
          description="모델명"
          onClick={handleClickCode}
          suffix={
            <>
              <Clipboard size="1.8rem" />
              복사
            </>
          }
        />
      )}

      {(isDetailView || isDetailInfoView) && (
        <div className="detail-view">
          {isDetailView && (
            <Button
              variant="tertiaryline"
              size="regular"
              bold
              onClick={handleContentClick}
              children={GoodsPageName.DETAIL}
            />
          )}
          {isDetailInfoView && (
            <Button
              variant="tertiaryline"
              size="regular"
              bold
              onClick={handleDetailInfoClick}
              children={GoodsPageName.DETAIL_INFO}
            />
          )}
        </div>
      )}
    </div>
  );
};

export const GoodsDescription = styled(GoodsDescriptionComponent)`
  position: relative;
  overflow: hidden;

  .benefit-info {
    border-radius: ${({ theme }) => theme.radius.r8};
    background: ${({ theme }) => theme.color.background.bg};
    padding-bottom: ${({ theme }) => theme.spacing.s12};
    margin: ${({ theme }) => `0 ${theme.spacing.s24} ${theme.spacing.s16}`};
  }

  .benefit-title {
    display: flex;
    align-items: flex-end;
    height: 4rem;
    padding: ${({ theme }) => `${theme.spacing.s8} ${theme.spacing.s16}`};
    color: ${({ theme }) => theme.color.text.textTertiary};
    font: ${({ theme }) => theme.fontType.mini};
  }

  .benefit-description {
    position: relative;
    padding: ${({ theme }) => `${theme.spacing.s4} ${theme.spacing.s16} ${theme.spacing.s4} ${theme.spacing.s32}`};
    color: ${({ theme }) => theme.color.text.textPrimary};
    font: ${({ theme }) => theme.fontType.small};

    &:after {
      position: absolute;
      top: 0.4rem;
      left: 1.6rem;
      font: ${({ theme }) => theme.fontType.medium};
      color: ${({ theme }) => theme.color.text.textPrimary};
      content: '•';
    }
  }

  .accom-info {
    padding-bottom: ${({ theme }) => theme.spacing.s12};
  }

  ${CollapseMoreSection} {
    padding: ${({ theme }) => `0 ${theme.spacing.s24} ${theme.spacing.s12}`};

    &.has-more-button {
      padding-bottom: 3.7rem;
    }
  }

  .detail-view {
    display: flex;
    padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24}`};

    ${Button} {
      width: 100%;

      & + ${Button} {
        margin-left: ${({ theme }) => theme.spacing.s8};
      }
    }
  }
`;
