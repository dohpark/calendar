import { render, screen } from '@/test-utils/testingLibrary';
import MonthCalendar from '@/components/MonthCalendar';
import { countMonthDays } from '@/utils/calendar';

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

test('지난달과 다음달의 날짜의 색상은 gray400이다. 현재 달의 날짜의 색상은 gray800이다.', () => {});

test('달의 첫번째 날은 00월 00일로 나타나고 나머지는 00일로 나타난다.', () => {});

test('00일 칸을 클릭하면 할일 및 이벤트 생성 모달이 나타난다.', () => {});

test('00일 숫자를 클릭하면 해당 날이 선택되며 달력 표시 유닛은 일로 설정된다.', () => {});

test('이벤트 혹은 할일 생성시 00일 칸에 할일 및 이벤트가 나타난다. 이벤트 우선, 유니코드 올림차순으로 정렬된다.', () => {});

test('00일 칸의 이벤트 / 할일 아이템을 클릭시 이벤트 / 할일 수정 모달이 나타난다.', () => {});

test('이벤트 및 할일이 너무 많은 경우 00개 더보기가 나타난다.', () => {});

test('00개 더보기 클릭시 이벤트 및 할일 전체를 나타내는 모달이 나타난다.', () => {});
