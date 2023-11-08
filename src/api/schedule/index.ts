import { CreateSchedule } from '@/types/schedule';
import axios, { AxiosError, AxiosResponse } from 'axios';
import API from '@/api/routes';

const scheduleApi = {
  create: async ({ title, description, type, from, until, allDay }: CreateSchedule) =>
    axios
      .post(API.SCHEDULE_URL, { title: title || '(제목 없음)', description, type, from, until, allDay })
      .then((response: AxiosResponse) => response)
      .catch((error: AxiosError) => error),
  delete: async () => {},
  getMonth: async () => {},
  getDay: async () => {},
  getWeek: async () => {},
};

export default scheduleApi;
