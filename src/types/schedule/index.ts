import { CalendarCreateType } from '@/types/calendar';

export interface Schedule {
  id: number;
  title: string;
  description: string | null;
  type: CalendarCreateType;
  from: Date;
  until: Date;
  allDay: boolean;
  deleted: boolean;
  createdAt: Date;
}

export type CreateSchedule = Omit<Schedule, 'id' | 'deleted' | 'createdAt'>;
