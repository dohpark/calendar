import { calendarUnitEng, calendarUnitKor, calendarCreate } from '@/constants/calendar';

type CalendarUnitEngTuple = typeof calendarUnitEng;
export type CalendarUnitEngType = CalendarUnitEngTuple[number];

type CalendarUnitKorTuple = typeof calendarUnitKor;
export type CalendarUnitKorType = CalendarUnitKorTuple[number];

export type CalendarCreateType = keyof typeof calendarCreate;
