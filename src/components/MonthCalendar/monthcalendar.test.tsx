import { render, renderHook, screen } from '@/test-utils/testingLibrary';
import MonthCalendar from '@/components/MonthCalendar';
import { countMonthDays } from '@/utils/calendar';
import { useMainCalendar } from '@/store/mainCalendar';
import { act } from 'react-dom/test-utils';

test('디폴트로 현재 월의 달력을 보인다.', () => {
  render(<MonthCalendar />);
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();
  const countDays = countMonthDays(today);

  const regexPattern = new RegExp(`${todayYear}-${todayMonth}`);

  const calendarButtons = screen.getAllByRole('button', { name: regexPattern });

  expect(calendarButtons).toHaveLength(countDays);
});

test('지난달과 다음달의 날짜의 색상은 gray400이다. 현재 달의 날짜의 색상은 gray800이다.', () => {
  render(<MonthCalendar />);

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
  render(<MonthCalendar />);

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

test('00일 칸을 클릭하면 할일 및 이벤트 생성 모달이 나타난다.', () => {});

test('00일 숫자를 클릭하면 해당 날이 선택되며 달력 표시 유닛은 일로 설정된다.', () => {});

test('이벤트 혹은 할일 생성시 00일 칸에 할일 및 이벤트가 나타난다. 이벤트 우선, 유니코드 올림차순으로 정렬된다.', () => {});

test('00일 칸의 이벤트 / 할일 아이템을 클릭시 이벤트 / 할일 수정 모달이 나타난다.', () => {});

test('이벤트 및 할일이 너무 많은 경우 00개 더보기가 나타난다.', () => {});

test('00개 더보기 클릭시 이벤트 및 할일 전체를 나타내는 모달이 나타난다.', () => {});
