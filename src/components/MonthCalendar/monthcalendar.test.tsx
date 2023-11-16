import { render, renderHook, screen, act, within, fireEvent } from '@/test-utils/testingLibrary';
import MonthCalendar from '@/components/MonthCalendar';
import { countMonthDays } from '@/utils/calendar';
import { useMainCalendar } from '@/store/mainCalendar';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';
import TestingQueryClientProvider from '@/test-utils/TestingQueryClientProvider';

test('디폴트로 현재 월의 달력을 보인다.', () => {
  render(<MonthCalendar />, { wrapper: TestingQueryClientProvider });
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();
  const countDays = countMonthDays(today);

  const regexPattern = new RegExp(`${todayYear}-${todayMonth}`);

  const calendarButtons = screen.getAllByRole('button', { name: regexPattern });

  expect(calendarButtons).toHaveLength(countDays);
});

test('지난달과 다음달의 날짜의 색상은 gray400이다. 현재 달의 날짜의 색상은 gray800이다.', () => {
  render(<MonthCalendar />, { wrapper: TestingQueryClientProvider });

  // 2023년 11월 28일로 날짜 설정
  const { result } = renderHook(() => useMainCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 10, 28)));

  // 현재 달 임의의 날짜 색상 확인
  const selectedDateButton = screen.getByRole('button', { name: '2023-11-4' });
  expect(selectedDateButton).toHaveClass('text-gray-800');

  // 화면에 부분적으로 나타난 전 달 임의의 날짜 색상 확인
  const lastMongthDateButton = screen.getByRole('button', { name: '2023-10-31' });
  expect(lastMongthDateButton).toHaveClass('text-gray-400');

  // 화면에 부분적으로 나타난 다음 달 임의의 날짜 색상 확인
  const nextMonthDateButton = screen.getByRole('button', { name: '2023-12-1' });
  expect(nextMonthDateButton).toHaveClass('text-gray-400');
});

test('달의 첫번째 날은 00월 00일로 나타나고 나머지는 00일로 나타난다.', () => {
  render(<MonthCalendar />, { wrapper: TestingQueryClientProvider });

  // 2023년 11월 28일로 날짜 설정
  const { result } = renderHook(() => useMainCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 10, 28)));

  // 2023년 11월 1일 버튼의 텍스트 확인
  const selectedButton = screen.getByRole('button', { name: '2023-11-28' });
  expect(selectedButton).toHaveTextContent('28');

  // 2023년 11월 1일 버튼의 텍스트 확인
  const novemberFirstButton = screen.getByRole('button', { name: '2023-11-1' });
  expect(novemberFirstButton).toHaveTextContent('11월 1일');

  // 2023년 12월 1일 버튼의 텍스트 확인
  const decemberFirstButton = screen.getByRole('button', { name: '2023-12-1' });
  expect(decemberFirstButton).toHaveTextContent('12월 1일');
});

test('00일 칸을 클릭하면 할일 및 이벤트 생성 모달이 나타난다.', async () => {
  const user = userEvent.setup();
  render(<MonthCalendar />, { wrapper: TestingQueryClientProvider });

  // 2023년 10월 28일로 날짜 설정
  const { result } = renderHook(() => useMainCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 9, 28)));

  // 10월 28일 칸 클릭
  const dateCell = screen.getByRole('gridcell', { name: '2023-10-28-cell' });
  await user.click(dateCell);

  const modal = screen.getByRole('dialog');
  expect(modal).toBeVisible();
});

test('00일 숫자를 클릭하면 해당 날이 선택되며 달력 표시 유닛은 일로 설정된다.', async () => {
  const user = userEvent.setup();
  render(<Home />, { wrapper: TestingQueryClientProvider });

  // 2023년 10월 28일로 날짜 설정
  const { result } = renderHook(() => useMainCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 9, 28)));

  // 10월 10일 칸 클릭
  const main = screen.getByRole('main');
  const dateButton = within(main).getByRole('button', { name: '2023-10-10' });
  await user.click(dateButton);

  // 헤더 날짜 확인
  const header = screen.getByRole('banner');
  const selectedDateDisaply = within(header).getByLabelText(/selected date/i);

  expect(selectedDateDisaply).toHaveTextContent(`2023년 10월 10일`);

  // 표시 유닛 일 확인
  const calendarUnit = within(header).getByRole('button', { name: /calendar view unit button/i });

  expect(calendarUnit).toHaveTextContent(`일`);
});

/**
 * viewport의 높이에 따라 테스트 결과값이 달라지기에 jest로 test하기에 부적절하다.
 * cypress로 test 할 것을 추천
 *
 * test('이벤트 혹은 할일 생성시 00일 칸에 할일 및 이벤트가 나타난다. 할일은 bg-lime-200 className을 지닌다. 이벤트는 bg-yellow-200 className을 지닌다.', async () => {});
 * test('00일 칸의 이벤트 / 할일 아이템을 클릭시 이벤트 / 할일 수정 모달이 나타난다.', () => {});
 * test('이벤트 및 할일이 너무 많은 경우 00개 더보기가 나타난다.', () => {});
 * test('00개 더보기 클릭시 이벤트 및 할일 전체를 나타내는 모달이 나타난다.', () => {});
 */

test('날짜를 드래그하여 드래그를 통해 선택한 날짜에 이벤트를 생성할 수 있다. 드래그하여 선택한 날짜의 배경 색상은 blue50이다.', async () => {
  render(<MonthCalendar />, { wrapper: TestingQueryClientProvider });

  // 2023년 10월 28일로 날짜 설정
  const { result } = renderHook(() => useMainCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 9, 28)));

  // 10월 5일에서 10월 11일까지 마우스 드래그
  const dateCellStart = screen.getByRole('gridcell', { name: '2023-10-5-cell' });
  const dateCellEnd = screen.getByRole('gridcell', { name: '2023-10-11-cell' });

  fireEvent.mouseEnter(dateCellStart);
  fireEvent.mouseDown(dateCellStart);
  fireEvent.mouseEnter(dateCellEnd);

  expect(dateCellStart).toHaveClass('bg-blue-50');
  expect(dateCellEnd).toHaveClass('bg-blue-50');

  // 마우스 손 놓으면 모달 나타나기
  fireEvent.mouseUp(dateCellEnd);
  const modal = screen.getByRole('dialog');
  expect(modal).toBeVisible();
});
