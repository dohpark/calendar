export const getDisplayedDateWeekUnit = (date: Date) => {
  const targetDate = new Date(date);
  const day = targetDate.getDay();

  targetDate.setDate(targetDate.getDate() - day);
  const firstDayYear = targetDate.getFullYear();
  const firstDayMonth = targetDate.getMonth() + 1;

  targetDate.setDate(targetDate.getDate() + 6);
  const lastDayYear = targetDate.getFullYear();
  const lastDayMonth = targetDate.getMonth() + 1;

  if (firstDayYear === lastDayYear) {
    if (firstDayMonth === lastDayMonth) {
      return `${firstDayYear}년 ${firstDayMonth}월`;
    }
    return `${firstDayYear}년 ${firstDayMonth}월 - ${lastDayMonth}월`;
  }
  return `${firstDayYear}년 ${firstDayMonth}월 - ${lastDayYear}년 ${lastDayMonth}월`;
};

export const countMonthDays = (date: Date) => {
  const targetDate = new Date(date);
  targetDate.setDate(1);
  targetDate.setMonth(targetDate.getMonth() + 1);
  targetDate.setDate(0);

  return targetDate.getDate();
};

export const createTimeItems = () => {
  const hours = Array.from({ length: 24 }, (_, hour) => hour);
  const minutes = [0, 15, 30, 45];
  const timeItems: { hour: number; minute: number; key: string }[] = [];

  hours.forEach((hour) => {
    minutes.forEach((minute) => {
      const item = { hour, minute, key: `${hour}:${minute}` };
      timeItems.push(item);
    });
  });

  return timeItems;
};

export const getTimeDisplay = (hour: number, minute: number) =>
  `${hour < 12 ? '오전' : '오후'} ${hour % 12 === 0 ? 12 : hour % 12}:${minute.toString().padStart(2, '0')}`;

/**
 * 월 달력에 몇 주 있는지 체크
 * */
export const countWeeksInMonthCalendar = (date: Date) => {
  const target = new Date(date);

  target.setDate(1);
  const lastMonthDaysofFirstWeekCount = target.getDay();

  const currentMonthDaysCount = countMonthDays(target);

  return Math.ceil((currentMonthDaysCount + lastMonthDaysofFirstWeekCount) / 7);
};

/**
 * 월 달력에 며칠이 존재하는지 확인 (첫번째 주의 지난달 날짜와 마지막 주의 다음달 날짜 포함)
 */
export const countDaysInMonthCalendar = (date: Date) => countWeeksInMonthCalendar(date) * 7;

/**
 * 월달력 첫째 주의 일요일 날짜
 */
export const getFirstDayInFirstWeekOfMonth = (date: Date) => {
  const targetDate = new Date(date);
  const days = targetDate.getDay();
  targetDate.setDate(targetDate.getDate() - days);
  return targetDate;
};

/**
 * 월 달력 마지막 주의 토요일 날짜
 */
export const getLastDayInLastWeekOfMonth = (date: Date) => {
  const firstDay = getFirstDayInFirstWeekOfMonth(date);
  const daysCount = countDaysInMonthCalendar(date);

  firstDay.setDate(firstDay.getDate() + daysCount - 1);

  return new Date(firstDay);
};

/**
 * 시간 값 포함하지 않는 date 받기
 */
export const getDateExcludingTime = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
