'use client';

import { useState } from 'react';
import Inline from '@/components/shared/layouts/Inline';
import Split from '@/components/shared/layouts/Split';
import IconButton from '@/components/shared/IconButton';
import TextButton from '@/components/shared/TextButton';
import ListBox from '@/components/shared/ListBox';
import Calendar from '@public/svg/calendar.svg';
import Hamburger from '@public/svg/hamburger.svg';
import Left from '@public/svg/left.svg';
import Right from '@public/svg/right.svg';
import DropDown from '@public/svg/drop_down.svg';
import CalendarUnitListItem from '@/components/Header/CalendarUnitListItem';
import { useMainCalendarStore } from '@/store/mainCalendar';
import { CalendarUnitEngType, CalendarUnitKorType } from '@/types/calendar';
import { getDisplayedDateWeekUnit } from '@/utils/calendar';
import { CalendarUnitListItemType } from './types';

export default function Header() {
  const [isDropdownHidden, setIsDropdownHidden] = useState(true);

  const { selectedDate, calendarUnit, actions } = useMainCalendarStore();

  const getDisplayedDate = (unit: CalendarUnitEngType) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();

    if (unit === 'D') {
      return `${year}년 ${month}월 ${day}일`;
    }
    if (unit === 'W') {
      return getDisplayedDateWeekUnit(selectedDate);
    }
    return `${year}년 ${month}월`;
  };

  const getDisplayedCalendarUnit = (unit: CalendarUnitEngType): CalendarUnitKorType => {
    if (unit === 'D') return '일';
    if (unit === 'W') return '주';
    return '월';
  };

  const handleLeftButton = (unit: CalendarUnitEngType) => {
    if (unit === 'D') actions.setPreviousDay();
    if (unit === 'W') actions.setPreviousWeek();
    if (unit === 'M') actions.setPreviousMonthFirstDay();
  };

  const handleRightButton = (unit: CalendarUnitEngType) => {
    if (unit === 'D') actions.setNextDay();
    if (unit === 'W') actions.setNextWeek();
    if (unit === 'M') actions.setNextMonthFirstDay();
  };

  const handleDropdown = () => {
    setIsDropdownHidden((state) => !state);
  };

  return (
    <header className="relative border-b border-gray-200">
      <Split fraction="auto-start" gap="0" classExtend={['p-2']}>
        <div className="w-[238px]">
          <Inline gap="0" justify="start" align="center">
            <IconButton
              aria-label="hamburger button"
              classExtend={['p-3', 'mx-1']}
              onClick={() => {
                actions.toggleSidebar();
              }}
            >
              <Hamburger width="24" height="24" />
            </IconButton>
            <span className="px-1">
              <Calendar width="32" height="32" />
            </span>
            <span className="text-xl pl-2">캘린더</span>
          </Inline>
        </div>
        <Inline gap="0" justify="between" align="center">
          <Inline gap="0" justify="start" align="center">
            <TextButton
              classExtend={['text-sm', 'px-5', 'py-2', 'mr-3']}
              onClick={() => {
                actions.setSelectedDate(new Date());
              }}
            >
              오늘
            </TextButton>
            <IconButton
              aria-label="left button"
              classExtend={['p-3']}
              onClick={() => {
                handleLeftButton(calendarUnit);
              }}
            >
              <Left width="12" height="12" />
            </IconButton>
            <IconButton
              aria-label="right button"
              classExtend={['p-3']}
              onClick={() => {
                handleRightButton(calendarUnit);
              }}
            >
              <Right width="12" height="12" />
            </IconButton>
            <span aria-label="selected date" className="text-xl px-4">
              {getDisplayedDate(calendarUnit)}
            </span>
          </Inline>
          <nav className="relative">
            <TextButton
              aria-label="calendar view unit button"
              aria-expanded={!isDropdownHidden}
              classExtend={['text-sm', 'px-3', 'py-2', 'mr-3']}
              onClick={handleDropdown}
            >
              <span className="pr-1 text-sm">{getDisplayedCalendarUnit(calendarUnit)}</span>
              <span>
                <DropDown width="16" height="16" className="inline-block " />
              </span>
            </TextButton>
            <ListBox<CalendarUnitListItemType>
              classExtend={[
                isDropdownHidden ? 'hidden' : 'block',
                'absolute',
                'top-11',
                'right-3',
                'grid',
                'py-2',
                'w-44',
                'z-50',
              ]}
              ItemComponent={CalendarUnitListItem}
              onClick={handleDropdown}
              sourceName="calendarUnitItem"
              items={[
                { key: 'day', dayEng: 'D', dayKor: '일' },
                { key: 'week', dayEng: 'W', dayKor: '주' },
                { key: 'month', dayEng: 'M', dayKor: '월' },
              ]}
            />
          </nav>
        </Inline>
      </Split>
    </header>
  );
}
