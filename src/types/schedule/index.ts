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
export type RenderType = 'start' | 'end' | 'continue' | 'startEnd';
export type ScheduleApi = Schedule & { renderType: RenderType; render: number };
export type ScheduleWithDateAndOrder = {
  date: Date;
  renderOrder: number[];
  schedules: ScheduleApi[];
  hiddenRender: number[];
};
export type ScheduleArray = ScheduleWithDateAndOrder[];
export type ScheduleArrayApi = { selectedMonthArray: ScheduleArray };
