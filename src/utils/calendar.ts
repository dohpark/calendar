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
