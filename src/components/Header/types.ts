import { CalendarUnitEngType, CalendarUnitKorType } from '@/types/calendar';

export interface ListItemType {
  key: string;
  dayEng: CalendarUnitEngType;
  dayKor: CalendarUnitKorType;
}
