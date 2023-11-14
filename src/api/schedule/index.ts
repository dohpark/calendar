import { CreateSchedule, ScheduleArrayApi } from '@/types/schedule';
import axios, { AxiosError, AxiosResponse } from 'axios';
import API from '@/api/routes';

const scheduleApi = {
  create: async ({ title, description, type, from, until, allDay }: CreateSchedule) =>
    axios
      .post(API.SCHEDULE_URL, { title: title || '(제목 없음)', description, type, from, until, allDay })
      .then((response: AxiosResponse) => response)
      .catch((error: AxiosError) => error),
  delete: async () => {},
  getMonth: async (year: number, month: number) =>
    axios
      .get(`${API.MONTH_SCHEDULE_URL}?year=${year}&month=${month}`)
      .then((response: AxiosResponse<ScheduleArrayApi>) => response.data.selectedMonthArray),
  getDay: async () => {},
  getWeek: async () => {},
};

export default scheduleApi;
