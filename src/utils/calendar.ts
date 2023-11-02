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
