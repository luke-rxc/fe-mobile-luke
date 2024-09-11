import { CalendarPostParams, postCalendarDayTimes } from '../options';
import { DateTimesSchema } from '../../schemas';

const calendarMockDateTime: DateTimesSchema = {
  goodsId: 24075,
  ticketUI: 'SEAT',
  ticketKind: 'CULTURE',
  displayPrice: true,
  userMaxPurchaseEa: 0,
  days: [
    {
      year: 2023,
      month: 12,
      day: 30,
      dayOfWeek: '토',
      times: [
        {
          dateTime: 1703929320000,
          minPrice: 1000,
          maxPrice: 1000,
          enable: true,
          purchasableStock: 1000,
          selectedValue: '2023 12월 3일 오전 12시',
          options: [],
        },
        {
          dateTime: 1703929450000,
          minPrice: 500,
          maxPrice: 500,
          enable: true,
          purchasableStock: 1000,
          selectedValue: '2023 12월 3일 오전 12시',
          options: [],
        },
      ],
    },
    {
      year: 2024,
      month: 2,
      day: 3,
      dayOfWeek: '토',
      times: [
        {
          dateTime: 1706959800000,
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          purchasableStock: 1000,
          selectedValue: '2023 12월 3일 오전 12시',
          options: [],
        },
        {
          dateTime: 1706963400000,
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          purchasableStock: 1000,
          selectedValue: '2023 12월 3일 오전 12시',
          options: [],
        },
      ],
    },
  ],
};

export const calendarMockDateTimeApi = ({
  goodsId, // eslint-disable-line @typescript-eslint/no-unused-vars
  components, // eslint-disable-line @typescript-eslint/no-unused-vars
  parameters, // eslint-disable-line @typescript-eslint/no-unused-vars
}: CalendarPostParams): ReturnType<typeof postCalendarDayTimes> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(calendarMockDateTime);
    }, 1000);
  });
