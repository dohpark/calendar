import { CalendarUnitEngType, CalendarUnitKorType, CalendarCreateType } from '@/types/calendar';

export interface CalendarUnitListItemType {
  key: string;
  dayEng: CalendarUnitEngType;
  dayKor: CalendarUnitKorType;
}

export interface CalendarCreateListItemType {
  key: string;
  createType: CalendarCreateType;
}
