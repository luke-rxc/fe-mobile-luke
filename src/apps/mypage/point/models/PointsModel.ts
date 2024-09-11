import React from 'react';
import { PointListItemProps } from '@pui/pointListItem';
import { PointsSchema } from '../schemas';

export type PointsModel = Omit<PointListItemProps, keyof Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>>[];

export const toPointsModel = (schema: PointsSchema): PointsModel => {
  const { content } = schema;

  return content.map(({ memo, amount, transactedDate, expireDate }) => ({
    title: memo,
    point: amount,
    savedDate: transactedDate,
    expiryDate: expireDate,
  }));
};
