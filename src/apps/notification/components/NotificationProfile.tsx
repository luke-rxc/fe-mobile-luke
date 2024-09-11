import React from 'react';
import styled from 'styled-components';
import {
  ArrowRight,
  Calendar,
  Checkmark,
  Claim,
  Close,
  Coupon,
  Delivery,
  Edit,
  Luggage,
  Order,
  Price,
  Tag,
} from '@pui/icon';
import { Profiles } from '@pui/profiles';
import { useTheme } from '@hooks/useTheme';
import { ProfileIconTypes } from '../constants';
import type { NotificationItemModel } from '../models';

interface NotificationProfileProps
  extends Pick<NotificationItemModel, 'profileIcon' | 'profileImage' | 'landingParameter'> {
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const NotificationProfile = styled(
  ({ className, profileIcon, profileImage, landingParameter, onClick: handleClick }: NotificationProfileProps) => {
    const { theme } = useTheme();
    const { showRoomCode, liveId } = landingParameter;

    // Icon 기본 속성값
    const iconDefaultProps = { size: '2.4rem', colorCode: theme.color.white };

    /* eslint-disable no-nested-ternary */
    return (
      <div className={className}>
        {profileImage ? (
          <Profiles
            showroomCode={showRoomCode ?? ''}
            liveId={liveId}
            image={{ src: profileImage.path, lazy: true }}
            size={44}
            status={profileImage.status}
            onClick={handleClick}
            disabledLink={!showRoomCode && !liveId}
          />
        ) : (
          profileIcon && (
            <IconStyled>
              {profileIcon === ProfileIconTypes.ARROW_RIGHT && <ArrowRight {...iconDefaultProps} />}
              {profileIcon === ProfileIconTypes.CALENDAR && <Calendar {...iconDefaultProps} />}
              {profileIcon === ProfileIconTypes.CHECKMARK && <Checkmark {...iconDefaultProps} />}
              {profileIcon === ProfileIconTypes.CLAIM && <Claim {...iconDefaultProps} />}
              {profileIcon === ProfileIconTypes.CLOSE && <Close {...iconDefaultProps} />}
              {profileIcon === ProfileIconTypes.COUPON && <Coupon {...iconDefaultProps} />}
              {profileIcon === ProfileIconTypes.DELIVERY && <Delivery {...iconDefaultProps} />}
              {profileIcon === ProfileIconTypes.EDIT && <Edit {...iconDefaultProps} />}
              {profileIcon === ProfileIconTypes.LUGGAGE && <Luggage {...iconDefaultProps} />}
              {profileIcon === ProfileIconTypes.ORDER && <Order {...iconDefaultProps} />}
              {profileIcon === ProfileIconTypes.PRICE && <Price {...iconDefaultProps} />}
              {profileIcon === ProfileIconTypes.TAG && <Tag {...iconDefaultProps} />}
            </IconStyled>
          )
        )}
      </div>
    );
  },
)`
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  width: 4.4rem;
  height: 4.4rem;
`;

const IconStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.color.black};
  border-radius: 50%;

  width: 3.2rem;
  height: 3.2rem;
`;
