import { act, render, renderHook, screen, within } from '@/test-utils/testingLibrary';
import userEvent from '@testing-library/user-event';
import Header from '@/components/Header';
import { useMainCalendar } from '@/store/mainCalendar';

describe('달력 단위 변경', () => {
  test('달력 단위 선택 버튼의 디폴트 값은 월이다.', () => {
    render(<Header />);
    const calendarViewUnitButton = screen.getByRole('button', { name: /calendar view unit button/i });

    expect(calendarViewUnitButton).toHaveTextContent(/월/i);
  });

  test('달력 단위 선택 버튼을 클릭 시 드랍다운이 화면에 나타난다.', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const calendarViewUnitButton = screen.getByRole('button', { name: /calendar view unit button/i });
    await user.click(calendarViewUnitButton);

    const calendarViewUnitList = screen.getByRole('list');
    expect(calendarViewUnitList).toBeVisible();

    const { getAllByRole } = within(calendarViewUnitList);
    const calendarViewUnitItems = getAllByRole('listitem');
    const calendarViewUnits = calendarViewUnitItems.map((item) => item.textContent);
    expect(calendarViewUnits).toEqual(['일D', '주W', '월M']);
  });

  test('드랍다운에서 일을 변경을 하면 오늘의 날짜로 변경된다.', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const calendarViewUnitButton = screen.getByRole('button', { name: /calendar view unit button/i });
    await user.click(calendarViewUnitButton);

    const calendarViewUnitDay = screen.getByRole('button', { name: /일/ });
    await user.click(calendarViewUnitDay);

    const today = new Date();

    const selectedDate = screen.getByLabelText(/selected date/i);
    expect(selectedDate).toHaveTextContent(`${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`);
  });
});

describe('왼쪽 및 오른쪽 버튼 기능', () => {
  test('월 단위로 선택 후 왼쪽 버튼 클릭 시 전 달 1일로 변경된다.', async () => {
    const user = userEvent.setup();
    render(<Header />);

    // 2023년 12월 28일로 날짜 설정
    const { result } = renderHook(() => useMainCalendar());
    act(() => result.current.actions.setSelectedDate(new Date(2023, 11, 28)));

    // 왼쪽 버튼 클릭 시 전 달로 이동
    const calendarLeftButton = screen.getByRole('button', { name: /left button/i });
    await user.click(calendarLeftButton);

    // 달력 유닛을 일로 선택
    const calendarViewUnitButton = screen.getByRole('button', { name: /calendar view unit button/i });
    await user.click(calendarViewUnitButton);

    const calendarViewUnitDay = screen.getByRole('button', { name: /일/ });
    await user.click(calendarViewUnitDay);

    // 2023년 11월 1일 확인
    const selectedDate = screen.getByLabelText(/selected date/i);
    expect(selectedDate).toHaveTextContent(`2023년 11월 1일`);
  });

  test('월 단위로 선택 후 오른쪽 버튼 클릭 시 다음 달 1일로 변경된다.', async () => {
    const user = userEvent.setup();
    render(<Header />);

    // 2023년 12월 28일로 날짜 설정
    const { result } = renderHook(() => useMainCalendar());
    act(() => result.current.actions.setSelectedDate(new Date(2023, 11, 28)));

    // 오른쪽 버튼 클릭 시 다음 달로 이동
    const calendarRightButton = screen.getByRole('button', { name: /right button/i });
    await user.click(calendarRightButton);

    // 달력 유닛을 일로 선택
    const calendarViewUnitButton = screen.getByRole('button', { name: /calendar view unit button/i });
    await user.click(calendarViewUnitButton);

    const calendarViewUnitDay = screen.getByRole('button', { name: /일/ });
    await user.click(calendarViewUnitDay);

    // 2024년 1월 1일을 확인
    const selectedDate = screen.getByLabelText(/selected date/i);
    expect(selectedDate).toHaveTextContent(`2024년 1월 1일`);
  });

  test('일 단위로 선택 후 왼쪽 버튼 클릭 시 전 날로 변경된다.', async () => {
    const user = userEvent.setup();
    render(<Header />);

    // 2023년 12월 1일로 날짜 설정
    const { result } = renderHook(() => useMainCalendar());
    act(() => result.current.actions.setSelectedDate(new Date(2023, 11, 1)));

    // 달력 유닛을 일로 선택
    const calendarViewUnitButton = screen.getByRole('button', { name: /calendar view unit button/i });
    await user.click(calendarViewUnitButton);

    const calendarViewUnitDay = screen.getByRole('button', { name: /일/ });
    await user.click(calendarViewUnitDay);

    // 왼쪽 버튼 클릭
    const calendarLeftButton = screen.getByRole('button', { name: /left button/i });
    await user.click(calendarLeftButton);

    // 2023년 11월 30일을 확인
    const selectedDate = screen.getByLabelText(/selected date/i);
    expect(selectedDate).toHaveTextContent(`2023년 11월 30일`);
  });
  test('일 단위로 선택 후 오른쪽 버튼 클릭 시 다음 날로 변경된다.', async () => {
    const user = userEvent.setup();
    render(<Header />);

    // 2023년 12월 31일로 날짜 설정
    const { result } = renderHook(() => useMainCalendar());
    act(() => result.current.actions.setSelectedDate(new Date(2023, 11, 31)));

    // 달력 유닛을 일로 선택
    const calendarViewUnitButton = screen.getByRole('button', { name: /calendar view unit button/i });
    await user.click(calendarViewUnitButton);

    const calendarViewUnitDay = screen.getByRole('button', { name: /일/ });
    await user.click(calendarViewUnitDay);

    // 오른쪽 버튼 클릭
    const calendarRightButton = screen.getByRole('button', { name: /right button/i });
    await user.click(calendarRightButton);

    // 2024년 1월 1일일 확인
    const selectedDate = screen.getByLabelText(/selected date/i);
    expect(selectedDate).toHaveTextContent(`2024년 1월 1일`);
  });
  test('주 단위로 선택 후 두 개의 달이 겹치는 주일 경우 "0000년 00월 - 00월 형식으로 보이게 한다.', async () => {
    const user = userEvent.setup();
    render(<Header />);

    // 2023년 10월 30일로 날짜 설정
    const { result } = renderHook(() => useMainCalendar());
    act(() => result.current.actions.setSelectedDate(new Date(2023, 9, 30)));

    // 달력 유닛을 주로 선택
    const calendarViewUnitButton = screen.getByRole('button', { name: /calendar view unit button/i });
    await user.click(calendarViewUnitButton);

    const calendarViewUnitWeek = screen.getByRole('button', { name: /주/ });
    await user.click(calendarViewUnitWeek);

    // 2023년 10월 - 11월 확인
    const selectedDate = screen.getByLabelText(/selected date/i);
    expect(selectedDate).toHaveTextContent(`2023년 10월 - 11월`);
  });
  test('주 단위로 선택 후 두 개의 연도가 다른 주일 경우 "0000년 00월 - 0000년 00월 형식으로 보이게 한다.', async () => {
    const user = userEvent.setup();
    render(<Header />);

    // 2023년 12월 31일로 날짜 설정
    const { result } = renderHook(() => useMainCalendar());
    act(() => result.current.actions.setSelectedDate(new Date(2023, 11, 31)));

    // 달력 유닛을 주로 선택
    const calendarViewUnitButton = screen.getByRole('button', { name: /calendar view unit button/i });
    await user.click(calendarViewUnitButton);

    const calendarViewUnitWeek = screen.getByRole('button', { name: /주/ });
    await user.click(calendarViewUnitWeek);

    // 2023년 12월 - 2024년 1월 확인
    const selectedDate = screen.getByLabelText(/selected date/i);
    expect(selectedDate).toHaveTextContent(`2023년 12월 - 2024년 1월`);
  });
});

describe('오늘 버튼', () => {
  test('오늘 버튼 클릭 시 오늘 날짜로 변경된다', async () => {
    const user = userEvent.setup();
    render(<Header />);

    // 2022년 4월 3일로 날짜 설정
    const { result } = renderHook(() => useMainCalendar());
    act(() => result.current.actions.setSelectedDate(new Date(2022, 3, 3)));

    // 오늘 버튼 클릭
    const todayButton = screen.getByRole('button', { name: /오늘/ });
    await user.click(todayButton);

    // 달력 유닛을 일로 선택
    const calendarViewUnitButton = screen.getByRole('button', { name: /calendar view unit button/i });
    await user.click(calendarViewUnitButton);

    const calendarViewUnitDay = screen.getByRole('button', { name: /일/ });
    await user.click(calendarViewUnitDay);

    // 오늘 날짜 확인
    const today = new Date();
    const selectedDate = screen.getByLabelText(/selected date/i);
    expect(selectedDate).toHaveTextContent(`${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`);
  });
});
