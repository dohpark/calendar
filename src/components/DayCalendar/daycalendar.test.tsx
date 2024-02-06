import TestingQueryClientProvider from '@/test-utils/TestingQueryClientProvider';
import { render, renderHook, screen, act, fireEvent, within } from '@/test-utils/testingLibrary';
import { useMainCalendarStore } from '@/store/mainCalendar';
import Main from '@/components/Main';
import userEvent from '@testing-library/user-event';

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
});

test('시간을 드래그하여 이벤트를 생성할 수 있다. 드래그 후 마우스를 놓으면 할일 및 이벤트 생성 모달이 나타난다. 드래그한 시간이 이벤트 생성 모달에 반영된다.', async () => {
  const user = userEvent.setup();

  render(<Main />, { wrapper: TestingQueryClientProvider });

  const { result } = renderHook(() => useMainCalendarStore());

  // 일달력으로 설정
  act(() => result.current.actions.setCalendarUnit('D'));
  // 2023년 10월 28일로 날짜 설정
  act(() => result.current.actions.setSelectedDate(new Date(2023, 9, 28)));

  // 10월 28일 00시에서 10월 28일 01시까지 마우스 드래그
  const dateCellStart = screen.getByRole('gridcell', { name: '0-0-cell' });
  const dateCellEnd = screen.getByRole('gridcell', { name: '0-45-cell' });

  fireEvent.mouseEnter(dateCellStart);
  fireEvent.mouseDown(dateCellStart);
  fireEvent.mouseEnter(dateCellEnd);

  // 마우스 손 놓으면 모달 나타나기
  fireEvent.mouseUp(dateCellEnd);
  const modal = screen.getByRole('dialog');
  expect(modal).toBeVisible();

  // 드래그한 날짜 반영 확인
  const eventRadio = within(modal).getByLabelText('이벤트');
  await user.click(eventRadio);

  const startDate = within(modal).getByRole('textbox', { name: /start time/i });
  expect(startDate).toHaveValue('오전 12:00');

  const endDate = within(modal).getByRole('textbox', { name: /end time/i });
  expect(endDate).toHaveValue('오전 1:00');
});

test('종일로 설정한 이벤트는 최상단에 나열된다', () => {});

test('시간을 설정한 이벤트는 시간에 맞춰 나열된다.', () => {});
