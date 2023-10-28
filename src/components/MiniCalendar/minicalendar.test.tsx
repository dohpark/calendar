import { act, render, renderHook, screen, within } from '@/test-utils/testingLibrary';
import MiniCalendar from '@/components/MiniCalendar';
import userEvent from '@testing-library/user-event';
import { useCalendar } from '@/store/calendar';
import Home from '@/app/page';

test('디폴트로 현재 월의 달력을 보인다.', () => {
  render(<MiniCalendar />);
  const miniCalendarDisplayDate = screen.getByRole('presentation', { name: /mini calendar display year and month/i });

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;

  expect(miniCalendarDisplayDate).toHaveTextContent(`${todayYear}년 ${todayMonth}월`);
});

test('미니달력에서 오늘 날짜의 배경색은 blue500이다.', () => {
  render(<MiniCalendar />);

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  // 오늘 날짜의 버튼 찾기
  const buttonLabel = `${todayYear}-${todayMonth}-${todayDate}`;
  const miniCalendarToday = screen.getByRole('button', { name: buttonLabel });

  // 오늘 날짜의 배경색 확인
  expect(miniCalendarToday).toHaveStyle({ 'background-color': 'rgb(59 130 246)' });
});

test('미니달력에서 선택한 날짜의 배경색은 blue200이다.', async () => {
  const user = userEvent.setup();
  render(<MiniCalendar />);

  // 2023년 11월 28일로 날짜 설정
  const { result } = renderHook(() => useCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 10, 28)));

  // 해당 달 임의의 날짜 클릭
  const targetDateButton = screen.getByRole('button', { name: '2023-11-7' });
  await user.click(targetDateButton);

  // 선택한 날짜 배경 색상 확인
  expect(targetDateButton).toHaveStyle({ 'background-color': 'rgb(191 219 254)' });
});

test('지난달과 다음달의 날짜의 색상은 gray500이다. 현재 달의 날짜의 색상은 gray600이다.', () => {
  render(<MiniCalendar />);

  // 2023년 11월 28일로 날짜 설정
  const { result } = renderHook(() => useCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 10, 28)));

  // 현재 달 임의의 날짜 색상 확인
  const selectedDateButton = screen.getByRole('button', { name: '2023-11-4' });
  expect(selectedDateButton).toHaveStyle({ 'background-color': 'rgb(75 85 99)' });

  // 화면에 부분적으로 나타난 전 달 임의의 날짜 색상 확인
  const lastMongthDateButton = screen.getByRole('button', { name: '2023-10-31' });
  expect(lastMongthDateButton).toHaveStyle({ 'background-color': 'rgb(107 114 128)' });

  // 화면에 부분적으로 나타난 다음 달 임의의 날짜 색상 확인
  const nextMonthDateButton = screen.getByRole('button', { name: '2023-12-1' });
  expect(nextMonthDateButton).toHaveStyle({ 'background-color': 'rgb(107 114 128)' });
});

test('미니달력의 왼쪽 버튼을 클릭 시 전달로 넘어간다.', async () => {
  const user = userEvent.setup();
  render(<MiniCalendar />);

  // 2024년 1월 15일로 날짜 설정
  const { result } = renderHook(() => useCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2024, 1, 15)));

  // 왼쪽 버튼 클릭
  const leftButton = screen.getByRole('button', { name: /left button/i });
  await user.click(leftButton);

  // 미니달력에 2023년 12월로 표시
  const miniCalendarDisplayDate = screen.getByRole('presentation', { name: /mini calendar display year and month/i });
  expect(miniCalendarDisplayDate).toHaveTextContent(`2023년 12월`);
});

test('미니달력의 오른쪽 버튼을 클릭 시 다음달로 넘어간다.', async () => {
  const user = userEvent.setup();
  render(<MiniCalendar />);

  // 2023년 11월 15일로 날짜 설정
  const { result } = renderHook(() => useCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 11, 15)));

  const rightButton = screen.getByRole('button', { name: /right button/i });
  await user.click(rightButton);

  // 미니달력에 2024년 1월로 표시
  const miniCalendarDisplayDate = screen.getByRole('presentation', { name: /mini calendar display year and month/i });
  expect(miniCalendarDisplayDate).toHaveTextContent(`2024년 1월`);
});

test('미니달력에서 날짜를 선택시 메인달력에서 선택 날짜가 반영된다.', async () => {
  const user = userEvent.setup();
  render(<Home />);

  // 2023년 12월 28일로 날짜 설정
  const { result } = renderHook(() => useCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 11, 28)));

  const miniCalendar = screen.getByRole('presentation', { name: 'mini calendar' });
  const { getByRole: getByRoleWithinMiniCalendar } = within(miniCalendar);

  // 미니달력에 왼쪽 버튼 클릭하여 전달로 이동
  const miniCalendarLeftButton = getByRoleWithinMiniCalendar('button', {
    name: /left button/i,
  });
  await user.click(miniCalendarLeftButton);

  // 2023년 11월 중 임의의 날짜 선택
  const targetDateButton = getByRoleWithinMiniCalendar('button', {
    name: '2023-11-7',
  });
  await user.click(targetDateButton);

  // 메인 달력에 선택 날짜 반영
  const header = screen.getByRole('banner');
  const { getByLabelText: getByLabelTextWithinHeader } = within(header);
  const selectedDateDisaply = getByLabelTextWithinHeader(/selected date/i);

  expect(selectedDateDisaply).toHaveTextContent(`2023년 11월`);
});

test('헤더에서 왼쪽 및 오른쪽 버튼을 클릭을 통한 날짜 선택이 미니달력에도 같이 반영이 된다.', async () => {
  const user = userEvent.setup();
  render(<Home />);

  // 2023년 12월 28일로 날짜 설정
  const { result } = renderHook(() => useCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 11, 28)));

  // 헤더의 왼쪽 버튼 클릭 시 전 달로 이동
  const mainCalendarLeftButton = screen.getByRole('button', { name: /main calendar left button/i });
  await user.click(mainCalendarLeftButton);

  // 미니달력에 2023년 11월로 표시
  const miniCalendarDisplayDate = screen.getByRole('presentation', { name: /mini calendar display year and month/i });
  expect(miniCalendarDisplayDate).toHaveTextContent(`2023년 11월`);
});
