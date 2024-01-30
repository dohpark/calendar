import { act, render, renderHook, screen, waitFor, within } from '@/test-utils/testingLibrary';
import userEvent from '@testing-library/user-event';
import { useMainCalendarStore } from '@/store/mainCalendar';
import Home from '@/app/page';
import TestingQueryClientProvider from '@/test-utils/TestingQueryClientProvider';

test('미니달력에서 날짜를 선택시 메인달력에서 선택 날짜가 반영된다.', async () => {
  const user = userEvent.setup();
  render(<Home />, { wrapper: TestingQueryClientProvider });

  // 2023년 12월 28일로 날짜 설정
  const { result } = renderHook(() => useMainCalendarStore());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 11, 28)));

  // 미니달력에 왼쪽 버튼 클릭하여 전달로 이동
  const miniCalendar = screen.getByRole('presentation', { name: 'mini calendar' });

  const miniCalendarLeftButton = within(miniCalendar).getByRole('button', {
    name: /left button/i,
  });
  await user.click(miniCalendarLeftButton);

  // 2023년 11월 중 임의의 날짜 선택
  const targetDateButton = within(miniCalendar).getByRole('button', {
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
  render(<Home />, { wrapper: TestingQueryClientProvider });

  // 2023년 12월 28일로 날짜 설정
  const { result } = renderHook(() => useMainCalendarStore());
  act(() => result.current.actions.setSelectedDate(new Date(2023, 11, 28)));

  // 헤더의 왼쪽 버튼 클릭 시 전 달로 이동
  const header = screen.getByRole('banner');
  const mainCalendarLeftButton = within(header).getByRole('button', { name: /left button/i });
  await user.click(mainCalendarLeftButton);

  // 미니달력에 2023년 11월로 표시
  await waitFor(() => {
    const miniCalendarDisplayDate = screen.getByRole('presentation', { name: /mini calendar display year and month/i });
    expect(miniCalendarDisplayDate).toHaveTextContent(`2023년 11월`);
  });
});
