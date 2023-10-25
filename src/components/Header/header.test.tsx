import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '@/components/Header';

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

    const calendarViewUnitDay = screen.getAllByRole('listitem').filter((item) => item.textContent === '일D')[0];
    await user.click(calendarViewUnitDay);

    const today = new Date();

    const selectedDate = screen.getByLabelText(/selected date/i);
    expect(selectedDate).toHaveTextContent(`${today.getFullYear}년 ${today.getMonth() + 1}월 ${today.getDate()}일`);
  });
});

describe.skip('왼쪽 및 오른쪽 버튼을 통한 선택 월 / 주 / 일 변경', () => {
  test('월 단위로 선택 후 왼쪽 버튼 클릭 시 전 달로 변경된다.', () => {});
  test('월 단위로 선택 후 오른쪽 버튼 클릭 시 전 달로 변경된다.', () => {});

  test('일 단위로 선택 후 왼쪽 버튼 클릭 시 전 주로 변경된다.', () => {});
  test('일 단위로 선택 후 오른쪽 버튼 클릭 시 전 주로 변경된다.', () => {});

  test('주 단위로 선택 후 두 개의 달이 겹치는 주일 경우 "0000년 00일 - 0000년 00일 형식으로 보이게 한다.', () => {});
});

describe.skip('오늘 버튼', () => {
  test('오늘 버튼 클릭 시 오늘 날짜로 변경된다', () => {});
});

describe.skip('햄버거 버튼을 통한 사이드바 관리', () => {
  test('디폴트로 사이드바가 화면에 나타나 있다', () => {});

  test('햄버거 버튼을 활용하여 사이드바를 열고 닫을 수 있다', () => {});
});
