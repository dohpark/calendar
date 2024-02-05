import TestingQueryClientProvider from '@/test-utils/TestingQueryClientProvider';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { useMainCalendarStore } from '@/store/mainCalendar';
import { act } from 'react-dom/test-utils';
import Main from '@/components/Main';

test('시간 칸을 클릭하면 할일 및 이벤트 생성 모달이 나타난다.', () => {});

test('시간을 드래그하여 이벤트를 생성할 수 있다. 드래그하여 선택한 시간의 배경 색상은 blue50이다.', async () => {
  render(<Main />, { wrapper: TestingQueryClientProvider });

  const { result } = renderHook(() => useMainCalendarStore());

  // 일달력으로 설정
  act(() => result.current.actions.setCalendarUnit('D'));
  // 2023년 10월 28일로 날짜 설정
  act(() => result.current.actions.setSelectedDate(new Date(2023, 9, 28)));

  // 10월 28일 00시에서 10월 28일 01시까지 마우스 드래그
  const dateCellStart = screen.getByRole('gridcell', { name: '0-0-cell' });
  const dateCellEnd = screen.getByRole('gridcell', { name: '0-45-cell' });
  const dateRandomCell = screen.getByRole('gridcell', { name: '3-0-cell' });

  fireEvent.mouseEnter(dateCellStart);
  fireEvent.mouseDown(dateCellStart);
  fireEvent.mouseEnter(dateCellEnd);

  expect(dateCellStart).toHaveClass('bg-blue-50');
  expect(dateCellEnd).toHaveClass('bg-blue-50');
  expect(dateRandomCell).not.toHaveClass('bg-blue-50');

  // TODO: 마우스 손 놓으면 모달 나타나기
});

test('종일로 설정한 이벤트는 최상단에 나열된다', () => {});

test('시간을 설정한 이벤트는 시간에 맞춰 나열된다.', () => {});
