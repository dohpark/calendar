import { useQuery } from '@tanstack/react-query';
import scheduleApi from '@/api/schedule';
import { ScheduleArray } from '@/types/schedule';
import { useMonthCalendar } from '@/store/monthCalendar';

/**
 * scheduleApi.getMonth에서 받은 월별 스케줄 데이터를 토대로 dateBoxSize에 맞춰 데이터를 가공하는 함수
 */
export default function useMonthData({ selectedDate }: { selectedDate: Date }) {
  const { calendar } = useMonthCalendar();

  const fetchSchedule = (): Promise<ScheduleArray> =>
    scheduleApi.getMonth(selectedDate.getFullYear(), selectedDate.getMonth() + 1);

  const { data = [], isSuccess } = useQuery({
    queryKey: [`${selectedDate.getFullYear()}-${selectedDate.getMonth()}`],
    queryFn: fetchSchedule,
    refetchOnWindowFocus: false,
  });

  // dateBoxSize의 높이에 맞춰 hiddenRender 계산
  const mutateData = () => {
    if (!data) return;
    const set = new Set<number>();
    const limit = Math.floor((calendar.dateBoxSize.height - 28) / 24);

    data.forEach(({ schedules, renderOrder }, index) => {
      if (renderOrder.length >= limit) {
        const hidden = renderOrder.slice(limit - 1);
        hidden.forEach((item) => {
          if (item !== -1) set.add(item);
        });
        const setArray = Array.from(set);

        // 1. hiddenRender에 추가
        data[index].hiddenRender = [...setArray];

        // 2. set의 element가 현재 renderType가 startend 혹은 end면 삭제
        setArray.forEach((item) => {
          const renderType = schedules.find((schedule) => schedule.id === item)?.renderType;
          if (renderType === 'end' || renderType === 'startEnd') set.delete(item);
        });
      }
    });
  };
  mutateData();

  return { data, isSuccess };
}
