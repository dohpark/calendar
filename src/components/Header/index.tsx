'use client';

import Inline from '@/components/layouts/Inline';
import Split from '@/components/layouts/Split';
import Calendar from '@public/svg/calendar.svg';
import Hamburger from '@public/svg/hamburger.svg';
import Left from '@public/svg/left.svg';
import Right from '@public/svg/right.svg';
import DropDown from '@public/svg/drop_down.svg';
import IconButton from '@/components/common/IconButton';
import TextButton from '../common/TextButton';

export default function Header() {
  return (
    <header>
      <Split fraction="auto-start" gap="0" classExtend={['p-2']}>
        <div className="w-[238px]">
          <Inline gap="0" justify="start" align="center">
            <IconButton
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
              classExtend={['p-3']}
              onClick={() => {
                console.log('left');
              }}
            >
              <Left width="12" height="12" />
            </IconButton>
            <IconButton
              classExtend={['p-3']}
              onClick={() => {
                console.log('right');
              }}
            >
              <Right width="12" height="12" />
            </IconButton>
            <span className="text-xl px-4">2023년 10월</span>
          </Inline>
          <TextButton
            classExtend={['text-sm', 'px-3', 'py-2', 'mr-3']}
            onClick={() => {
              console.log('일 / 주 / 연도');
            }}
          >
            <span className="pr-1 text-sm">일</span>
            <span>
              <DropDown width="16" height="16" className="inline-block " />
            </span>
          </TextButton>
        </Inline>
      </Split>
    </header>
  );
}
