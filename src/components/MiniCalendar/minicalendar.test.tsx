import { act, render, renderHook, screen } from '@/test-utils/testingLibrary';
import MiniCalendar from '@/components/MiniCalendar';
import userEvent from '@testing-library/user-event';
import { useMainCalendar } from '@/store/mainCalendar';

test('선택 날짜의 월을 디폴트로 보인다.', () => {
  // 2023년 10월 18일로 설정
  const { result } = renderHook(() => useMainCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 9, 18)));

  render(
    <MiniCalendar selectedDate={result.current.selectedDate} selectDate={result.current.actions.setSelectedDate} />,
  );
  const miniCalendarDisplayDate = screen.getByRole('presentation', { name: /mini calendar display year and month/i });

  expect(miniCalendarDisplayDate).toHaveTextContent(`${2023}년 ${10}월`);
});

test('미니달력에서 오늘 날짜의 배경색은 blue500이다.', () => {
  // default로 오늘날짜 설정
  const { result } = renderHook(() => useMainCalendar());

  render(
    <MiniCalendar selectedDate={result.current.selectedDate} selectDate={result.current.actions.setSelectedDate} />,
  );

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  // 오늘 날짜의 버튼 찾기
  const buttonLabel = `${todayYear}-${todayMonth}-${todayDate}`;
  const miniCalendarToday = screen.getByRole('button', { name: buttonLabel });

  // 오늘 날짜의 배경색 확인
  expect(miniCalendarToday).toHaveClass('bg-blue-500');
});

test('미니달력에서 선택한 날짜의 배경색은 blue200이다.', async () => {
  // 2023년 10월 18일로 설정
  const { result } = renderHook(() => useMainCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 9, 18)));

  const user = userEvent.setup();
  render(
    <MiniCalendar selectedDate={result.current.selectedDate} selectDate={result.current.actions.setSelectedDate} />,
  );

  // 해당 달 임의의 날짜 클릭
  const targetDateButton = screen.getByRole('button', { name: '2023-10-18' });
  await user.click(targetDateButton);

  // 선택한 날짜 배경 색상 확인
  expect(targetDateButton).toHaveClass('bg-blue-200');
});

test('지난달과 다음달의 날짜의 색상은 gray400이다. 현재 달의 날짜의 색상은 gray600이다.', () => {
  // 2023년 11월 28일로 날짜 설정
  const { result } = renderHook(() => useMainCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 10, 28)));

  render(
    <MiniCalendar selectedDate={result.current.selectedDate} selectDate={result.current.actions.setSelectedDate} />,
  );

  // 현재 달 임의의 날짜 색상 확인
  const selectedDateButton = screen.getByRole('button', { name: '2023-11-4' });
  expect(selectedDateButton).toHaveClass('text-gray-600');

  // 화면에 부분적으로 나타난 전 달 임의의 날짜 색상 확인
  const lastMongthDateButton = screen.getByRole('button', { name: '2023-10-31' });
  expect(lastMongthDateButton).toHaveClass('text-gray-400');

  // 화면에 부분적으로 나타난 다음 달 임의의 날짜 색상 확인
  const nextMonthDateButton = screen.getByRole('button', { name: '2023-12-1' });
  expect(nextMonthDateButton).toHaveClass('text-gray-400');
});

test('미니달력의 왼쪽 버튼을 클릭 시 전달로 넘어간다.', async () => {
  // 2024년 1월 15일로 날짜 설정
  const { result } = renderHook(() => useMainCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2024, 0, 15)));

  const user = userEvent.setup();
  render(
    <MiniCalendar selectedDate={result.current.selectedDate} selectDate={result.current.actions.setSelectedDate} />,
  );

  // 왼쪽 버튼 클릭
  const leftButton = screen.getByRole('button', { name: /left button/i });
  await user.click(leftButton);

  // 미니달력에 2023년 12월로 표시
  const miniCalendarDisplayDate = screen.getByRole('presentation', { name: /mini calendar display year and month/i });
  expect(miniCalendarDisplayDate).toHaveTextContent(`2023년 12월`);
});

test('미니달력의 오른쪽 버튼을 클릭 시 다음달로 넘어간다.', async () => {
  // 2023년 12월 15일로 날짜 설정
  const { result } = renderHook(() => useMainCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 11, 15)));

  const user = userEvent.setup();
  render(
    <MiniCalendar selectedDate={result.current.selectedDate} selectDate={result.current.actions.setSelectedDate} />,
  );

  const rightButton = screen.getByRole('button', { name: /right button/i });
  await user.click(rightButton);

  // 미니달력에 2024년 1월로 표시
  const miniCalendarDisplayDate = screen.getByRole('presentation', { name: /mini calendar display year and month/i });
  expect(miniCalendarDisplayDate).toHaveTextContent(`2024년 1월`);
});
