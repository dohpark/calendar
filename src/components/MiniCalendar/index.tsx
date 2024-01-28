import { useEffect, useState } from 'react';
import Inline from '@/components/shared/layouts/Inline';
import Layer from '@/components/shared/layouts/Layer';
import Split from '@/components/shared/layouts/Split';
import IconButton from '@/components/shared/IconButton';
import DateButton from '@/components/shared/DateButton';
import Left from '@public/svg/left.svg';
import Right from '@public/svg/right.svg';
import { DAYS_OF_THE_WEEK } from '@/constants/calendar';

interface MiniCalendarProps {
  classExtend?: string[];
  selectedDate: Date;
  selectDate: (date: Date) => void;
  disabledFilterCallback?: (date: Date) => boolean;
}

/**
 *
 * 미니 캘린더는 세가지의 Date를 지닌다.
 * 1. 선택 날짜 (selectedDate)
 * 2. 달력이 display해야할 연 월 (displayDate)
 * 3. 오늘 날짜 (today)
 *
 * params로 선택 날짜를 받는데 이는 displayDate의 default 값이 된다.
 * 달력에서 날짜를 클릭하면 selectDate 콜백 함수가 실행된다.
 * selectDate 함수는 selectedDate의 set함수이다.
 *
 * selectedDate와 displayDate의 연 월이 같지 않으면 displayDate가 selectedDate의 연 월에 맞춘다.
 *
 * disabledFilterCallback을 통해 disable 해야할 버튼들을 filter한다.
 *
 */
export default function MiniCalendar({
  classExtend,
  selectedDate,
  selectDate,
  disabledFilterCallback,
}: MiniCalendarProps) {
  const today = new Date();
  const [displayDate, setDisplayDate] = useState(new Date(selectedDate));

  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  const displayYear = displayDate.getFullYear();
  const displayMonth = displayDate.getMonth() + 1;

  const selectedDateYear = selectedDate.getFullYear();
  const selectedDateMonth = selectedDate.getMonth() + 1;

  /**
   *  selectedDate의 변화에 맞춰 displayDate에도 변화를 준다.
   */
  useEffect(() => {
    if (selectedDateYear !== displayYear || selectedDateMonth !== displayMonth) {
      setDisplayDate(new Date(selectedDateYear, selectedDateMonth - 1, 1));
    }
  }, [selectedDate]);

  /**
   * 미니캘린더가 지녀야할 날들을 생성한다.
   * displayDate의 년 월을 기준으로 한다.
   */
  const displayMonthDateArray = Array.from({ length: 42 }, (_, index) => {
    const targetDate = new Date(displayDate);
    targetDate.setDate(1);
    const day = targetDate.getDay();

    targetDate.setDate(targetDate.getDate() - day + index);
    return [targetDate.getFullYear(), targetDate.getMonth() + 1, targetDate.getDate()];
  });

  const increaseMiniCalendarMonth = () => {
    const targetDate = new Date(displayDate);
    targetDate.setDate(1);
    targetDate.setMonth(displayDate.getMonth() + 1);

    setDisplayDate(targetDate);
  };
  const decreaseMiniCalendarMonth = () => {
    const targetDate = new Date(displayDate);
    targetDate.setDate(1);
    targetDate.setMonth(displayDate.getMonth() - 1);

    setDisplayDate(targetDate);
  };

  const getDateButtonCss = (year: number, month: number, date: number) => {
    // 오늘 날짜 css
    if (todayYear === year && todayMonth === month && todayDate === date)
      return 'bg-blue-500 text-white hover:!bg-blue-600';
    // 선택 날짜 css
    if (selectedDate.getFullYear() === year && selectedDate.getMonth() + 1 === month && selectedDate.getDate() === date)
      return 'bg-blue-200 text-blue-500 hover:!bg-blue-300';
    // 전달 혹은 다음 달 날짜 css
    if (month !== displayDate.getMonth() + 1) return 'text-gray-400';
    // 이번 달 날짜 css
    return 'text-gray-600';
  };

  const checkDisabled = (date: Date) => {
    if (!disabledFilterCallback) return false;
    return disabledFilterCallback(date);
  };
  const classExtension = classExtend ? classExtend.join(' ') : '';
  return (
    <div className={`${classExtension}`} role="presentation" aria-label="mini calendar">
      <Layer gap="0">
        <Split fraction="3/4" gap="0" classExtend={['items-center']}>
          <div
            className="text-sm pl-2 text-gray-800"
            role="presentation"
            aria-label="mini calendar display year and month"
          >{`${displayYear}년 ${displayMonth}월`}</div>
          <Inline gap="0" justify="end" align="center">
            <IconButton
              aria-label="mini calendar left button"
              type="button"
              classExtend={['p-2']}
              onClick={decreaseMiniCalendarMonth}
            >
              <span>
                <Left width="10" height="10" />
              </span>
            </IconButton>
            <IconButton
              aria-label="mini calendar right button"
              type="button"
              classExtend={['p-2']}
              onClick={increaseMiniCalendarMonth}
            >
              <span>
                <Right width="10" height="10" />
              </span>
            </IconButton>
          </Inline>
        </Split>
        <div className="grid grid-cols-7 py-2 text-xs text-center text-gray-500">
          {DAYS_OF_THE_WEEK.map((value) => (
            <div key={value} className="">
              {value}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-xs text-center">
          {displayMonthDateArray.map(([year, month, date]) => (
            <DateButton
              key={`${year}-${month}-${date}`}
              year={year}
              month={month}
              date={date}
              classExtend={[
                'justify-self-center',
                getDateButtonCss(year, month, date),
                'disabled:cursor-not-allowed',
                'disabled:text-gray-200',
              ]}
              onClick={() => selectDate(new Date(year, month - 1, date))}
              disabled={checkDisabled(new Date(year, month - 1, date))}
            >
              {date}
            </DateButton>
          ))}
        </div>
      </Layer>
    </div>
  );
}
