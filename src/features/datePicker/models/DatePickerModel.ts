import { CalendarDaysSchema, CalendarSchema, MonthsSchema } from '../schemas';

export interface CalendarDaysModel extends CalendarDaysSchema {
  year: number;
  month: number;
  monthIndex: number;
  dayIndex: number;
  flatIndex: number;
}

export interface MonthsModel extends Omit<MonthsSchema, 'days'> {
  days: CalendarDaysModel[];
}

export type CalendarModel<T extends CalendarSchema = CalendarSchema> = Omit<T, 'months'> & {
  months: MonthsModel[];
};

export const toCalendarData = <T extends CalendarSchema>(data: T): CalendarModel<T> => {
  const { months, ...rest } = data;
  let flatIndex = -1;
  return {
    months: [
      ...months.map(({ year, month, days, ...monthRest }, monthIndex) => {
        return {
          year,
          month,
          days: [
            ...days.map((dayInfo, dayIndex) => {
              flatIndex += 1;

              return {
                year,
                month,
                monthIndex,
                dayIndex,
                flatIndex,
                ...dayInfo,
              };
            }),
          ],
          ...monthRest,
        };
      }),
    ],
    ...rest,
  };
};

export const toFlatDates = (months: MonthsModel[]): CalendarDaysModel[] => {
  const monthsData = months.map(({ days }) => {
    return {
      days: [
        ...days.map((dayInfo) => {
          return {
            ...dayInfo,
          };
        }),
      ],
    };
  });

  return monthsData.flatMap(({ days }) => [...days]);
};
