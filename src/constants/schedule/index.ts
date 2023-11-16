import { Schedule } from '@/types/schedule';

export const InitialScheduleInfo: Schedule = {
  id: 0,
  title: '',
  description: null,
  type: 'event',
  from: new Date(),
  until: new Date(),
  allDay: false,
  deleted: false,
  createdAt: new Date(),
};
