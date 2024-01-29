import { CalendarUnitEngType, CalendarUnitKorType } from '@/types/calendar';

export interface CalendarUnitListItemType {
  key: string;
  dayEng: CalendarUnitEngType;
  dayKor: CalendarUnitKorType;
}
