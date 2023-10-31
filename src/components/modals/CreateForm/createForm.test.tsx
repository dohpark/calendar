import { render, renderHook, screen, act, fireEvent, within } from '@/test-utils/testingLibrary';
import MonthCalendar from '@/components/MonthCalendar';
import { useMainCalendar } from '@/store/mainCalendar';
import userEvent from '@testing-library/user-event';

test('월 달력에서 드래그를 통해 여러 날을 선택하면 이벤트 생성시 드래그한 날들이 모달에 반영된다. 그러나 시간을 선택할 수 없다.', () => {
  render(<MonthCalendar />);

  // 2023년 10월 28일로 날짜 설정
  const { result } = renderHook(() => useMainCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 9, 28)));

  // 10월 5일에서 10월 11일까지 마우스 드래그
  const dateCellStart = screen.getByRole('gridcell', { name: '2023-10-5-cell' });
  const dateCellEnd = screen.getByRole('gridcell', { name: '2023-10-11-cell' });

  fireEvent.mouseEnter(dateCellStart);
  fireEvent.mouseDown(dateCellStart);
  fireEvent.mouseEnter(dateCellEnd);

  // 마우스 손 놓으면 모달 나타나기
  fireEvent.mouseUp(dateCellEnd);
  const modal = screen.getByRole('dialog');
  expect(modal).toBeVisible();

  // 드래그한 날짜 반영 확인
  const selectedDate = within(modal).getByRole('presentation', { name: /selected date/i });
  expect(selectedDate).toHaveTextContent('10월 5일 (목)-10월 11일 (수)');
});

test('월 달력에서 이벤트 생성시 타입을 할일로 선택하면 하루만 선택 가능하다. 여러 날을 드래그로 통해 선택해도 타입을 할일로 바꾸면 드래그한 첫번째 날로 선택된다.', async () => {
  const user = userEvent.setup();
  render(<MonthCalendar />);

  // 2023년 10월 28일로 날짜 설정
  const { result } = renderHook(() => useMainCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 9, 28)));

  // 10월 5일에서 10월 11일까지 마우스 드래그
  const dateCellStart = screen.getByRole('gridcell', { name: '2023-10-5-cell' });
  const dateCellEnd = screen.getByRole('gridcell', { name: '2023-10-11-cell' });

  fireEvent.mouseEnter(dateCellStart);
  fireEvent.mouseDown(dateCellStart);
  fireEvent.mouseEnter(dateCellEnd);

  // 마우스 손 놓으면 모달 나타나기
  fireEvent.mouseUp(dateCellEnd);
  const modal = screen.getByRole('dialog');
  expect(modal).toBeVisible();

  // 할일 라디오 라벨 클릭
  const todoRadio = within(modal).getByLabelText('할 일');
  await user.click(todoRadio);

  // 드래그한 첫번째 날짜만 반영 확인
  const selectedDate = within(modal).getByRole('presentation', { name: /selected date/i });
  expect(selectedDate).toHaveTextContent('10월 5일 (목)');
});

test('이벤트 생성 타입을 할일로 선택하면 시간을 선택하거나 종일로 선택할 수 있다.', async () => {
  const user = userEvent.setup();
  render(<MonthCalendar />);

  // 2023년 10월 28일로 날짜 설정
  const { result } = renderHook(() => useMainCalendar());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 9, 28)));

  // 10월 5일에서 10월 11일까지 마우스 드래그
  const dateCellStart = screen.getByRole('gridcell', { name: '2023-10-5-cell' });
  const dateCellEnd = screen.getByRole('gridcell', { name: '2023-10-11-cell' });

  fireEvent.mouseEnter(dateCellStart);
  fireEvent.mouseDown(dateCellStart);
  fireEvent.mouseEnter(dateCellEnd);

  // 마우스 손 놓으면 모달 나타나기
  fireEvent.mouseUp(dateCellEnd);
  const modal = screen.getByRole('dialog');
  expect(modal).toBeVisible();

  // 할일 라디오 라벨 클릭
  const todoRadio = within(modal).getByLabelText('할 일');
  await user.click(todoRadio);

  // 할일 라디오 라벨 클릭
  const allDayCheckbox = within(modal).getByLabelText('종일');
  await user.click(allDayCheckbox);

  // 날짜 및 시간 반영 확인
  const selectedDate = within(modal).getByRole('presentation', { name: /selected date/i });
  expect(selectedDate).toHaveTextContent('10월 5일 (목)오전 12:00');
});

test('모달에서 날짜 선택 수정시 메인 달력에 반영된다. (메인 달력에서 선택한 날짜들의 배경 색상은 blue50이다.)', () => {});

test('주, 일 달력에서는 이벤트 / 할일 상관없이 여러날을 선택할 수 없다. 대신 시간을 선택할 수 있다. 종일을 선택시 시간을 선택 안해도 된다.', () => {});
