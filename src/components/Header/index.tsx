'use client';

import { useState } from 'react';
import Inline from '@/components/layouts/Inline';
import Split from '@/components/layouts/Split';
import IconButton from '@/components/common/IconButton';
import TextButton from '@/components/common/TextButton';
import ListBox from '@/components/common/ListBox';
import Calendar from '@public/svg/calendar.svg';
import Hamburger from '@public/svg/hamburger.svg';
import Left from '@public/svg/left.svg';
import Right from '@public/svg/right.svg';
import DropDown from '@public/svg/drop_down.svg';
import ListItem from '@/components/Header/ListItem';
import { ListItemType } from './types';

export default function Header() {
  const [isDropdownHidden, setIsDropdownHidden] = useState(true);

  const handleDropdown = () => {
    setIsDropdownHidden((state) => !state);
  };

  return (
    <header>
      <Split fraction="auto-start" gap="0" classExtend={['p-2']}>
        <div className="w-[238px]">
          <Inline gap="0" justify="start" align="center">
            <IconButton
              aria-label="hamburger button"
              classExtend={['p-3', 'mx-1']}
              onClick={() => {
                console.log('hamburger');
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
                console.log('오늘');
              }}
            >
              오늘
            </TextButton>
            <IconButton
              aria-label="left button"
              classExtend={['p-3']}
              onClick={() => {
                console.log('left');
              }}
            >
              <Left width="12" height="12" />
            </IconButton>
            <IconButton
              aria-label="right button"
              classExtend={['p-3']}
              onClick={() => {
                console.log('right');
              }}
            >
              <Right width="12" height="12" />
            </IconButton>
            <span aria-label="selected date" className="text-xl px-4">
              2023년 10월
            </span>
          </Inline>
          <nav className="relative">
            <TextButton
              aria-label="calendar view unit button"
              aria-expanded={!isDropdownHidden}
              classExtend={['text-sm', 'px-3', 'py-2', 'mr-3']}
              onClick={handleDropdown}
            >
              <span className="pr-1 text-sm">월</span>
              <span>
                <DropDown width="16" height="16" className="inline-block " />
              </span>
            </TextButton>
            <ListBox<ListItemType>
              classExtend={[
                isDropdownHidden ? 'hidden' : 'block',
                'absolute',
                'top-11',
                'right-3',
                'grid',
                'py-2',
                'w-44',
              ]}
              ItemComponent={ListItem}
              onClick={handleDropdown}
              sourceName="item"
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
