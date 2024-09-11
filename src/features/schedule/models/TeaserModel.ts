import React from 'react';
import { PickFunctionProperty } from '../types';
import { TeaserSchema, ShowroomSchema } from '../schemas';
import { TeaserProps } from '../components';

/**
 *
 */
type TeaserModel = Omit<
  TeaserProps,
  keyof React.HTMLAttributes<HTMLDivElement> | keyof PickFunctionProperty<TeaserProps>
>;

/**
 *
 */
type TeaserShowroomModel = Omit<TeaserModel['host'], keyof PickFunctionProperty<TeaserModel['host']>>;

/**
 *
 */
export const toTeaserModel = (schema: TeaserSchema): TeaserModel => {
  const { description, liveSchedule, hostShowRoom, guestShowRoomList } = schema;
  const { textColor, tintColor } = hostShowRoom;
  const { live, isFollowed: followed } = liveSchedule;

  return {
    host: toTeaserShowroomModel(hostShowRoom),
    guests: guestShowRoomList && guestShowRoomList.map((item) => toTeaserShowroomModel(item)),
    followed,
    description,
    liveId: live.id,
    hostMainColorCode: tintColor,
    hostSubColorCode: textColor,
  };
};

/**
 *
 */
export const toTeaserShowroomModel = (schema: ShowroomSchema): TeaserShowroomModel => {
  const { id, code, backgroundColor, isFollowed, name, onAir, primaryImage, liveId } = schema;

  return {
    title: name,
    onAir,
    liveId,
    followed: isFollowed,
    showroomId: id,
    showroomCode: code,
    imageURL: primaryImage?.path,
    mainColorCode: backgroundColor,
  };
};
